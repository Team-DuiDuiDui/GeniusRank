package com.nine.project.analyze.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nine.project.analyze.dao.entity.GithubUserScoreDO;
import com.nine.project.analyze.dao.mapper.GithubUserScoreMapper;
import com.nine.project.analyze.dto.req.GithubDetailedScoreReqDTO;
import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRankRespDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;
import com.nine.project.analyze.dto.resp.RankRespDTO;
import com.nine.project.analyze.dto.resp.UserRankRespDTO;
import com.nine.project.analyze.mq.event.SaveDetailedScoreAndTypeEvent;
import com.nine.project.analyze.mq.event.SaveScoreAndTypeEvent;
import com.nine.project.analyze.mq.produce.SaveDetailedScoreAndTypeProducer;
import com.nine.project.analyze.mq.produce.SaveScoreAndTypeProducer;
import com.nine.project.analyze.service.GithubUserScoreService;
import com.nine.project.analyze.toolkit.CacheUtil;
import com.nine.project.analyze.toolkit.GithubDetailedScoreCalculator;
import com.nine.project.analyze.toolkit.GithubUserScoreCalculator;
import com.nine.project.framework.exception.ClientException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static com.nine.project.analyze.constant.RedisCacheConstant.*;
import static com.nine.project.framework.errorcode.BaseErrorCode.USER_SCORE_NOT_FOUND;


/**
 * Github 用户分数计算服务接口实现层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GithubUserScoreServiceImpl extends ServiceImpl<GithubUserScoreMapper, GithubUserScoreDO> implements GithubUserScoreService {

    private final CacheUtil<GithubUserScoreRespDTO> cacheUtil;
    private final SaveScoreAndTypeProducer saveScoreAndTypeProducer;
    private final SaveDetailedScoreAndTypeProducer saveDetailedScoreAndTypeProducer;

    @Override
    public GithubUserScoreRespDTO getGithubUserScore(String githubUserId) {
        String cacheKey = USER_SCORE_KEY + githubUserId;

        UserRankRespDTO githubUserRank = getGithubUserRank(githubUserId);
        Integer rank = githubUserRank.getRank();

        // 从缓存中获取
        Map<Object, Object> cachedData = cacheUtil.getMapFromCacheHash(cacheKey);
        if (!cachedData.isEmpty()) {
            cachedData.put("rank", rank);
            return BeanUtil.fillBeanWithMap(cachedData, GithubUserScoreRespDTO.builder().build(), true);
        }

        // 如果缓存中不存在，从数据库中查询
        LambdaQueryWrapper<GithubUserScoreDO> queryWrapper = Wrappers.lambdaQuery(GithubUserScoreDO.class)
                .eq(GithubUserScoreDO::getLogin, githubUserId)
                .eq(GithubUserScoreDO::getDelFlag, 0);

        GithubUserScoreDO userScoreDO = this.getOne(queryWrapper);
        if (userScoreDO == null) {
            throw new ClientException(USER_SCORE_NOT_FOUND);
        }

        // 封装响应数据
        GithubUserScoreRespDTO respDTO = BeanUtil.copyProperties(userScoreDO, GithubUserScoreRespDTO.class);
        respDTO.setRank(rank);
        respDTO.setUpdateTime(Instant.now().getEpochSecond());

        // 存入缓存
        return cacheUtil.send2CacheHash(cacheKey, respDTO, USER_SCORE_EXPIRE_TIME, TimeUnit.SECONDS);
    }

    @Override
    public GithubUserScoreRespDTO generateScore(GithubUserScoreReqDTO requestParams) {
        // 计算分数
        GithubUserScoreRespDTO scores = GithubUserScoreCalculator.calculate(requestParams);

        // 使用 RocketMQ 异步持久化用户分数和开发者领域
        saveScoreAndTypeProducer.sendMessage(new SaveScoreAndTypeEvent(requestParams, scores));

        // 封装并返回分数
        scores.setName(requestParams.getUser().getName());
        scores.setAvatarUrl(requestParams.getUser().getAvatar_url());
        scores.setUpdateTime(Instant.now().getEpochSecond());
        return scores;
    }

    @Override
    public GithubUserScoreRespDTO generateScoreDetail(GithubDetailedScoreReqDTO requestParams) {
        // 计算分数
        GithubUserScoreRespDTO scores = GithubDetailedScoreCalculator.calculate(requestParams);

        // 使用 RocketMQ 异步持久化用户分数和开发者领域
        saveDetailedScoreAndTypeProducer.sendMessage(new SaveDetailedScoreAndTypeEvent(requestParams, scores));

        // 封装并返回分数
        scores.setName(requestParams.getName());
        scores.setAvatarUrl(requestParams.getAvatarUrl());
        scores.setUpdateTime(Instant.now().getEpochSecond());
        return scores;
    }

    @Override
    public RankRespDTO getGithubUserScoreRank(Integer size, List<String> nation, List<String> type) {
        List<GithubUserScoreRankRespDTO> scoreRankList;
        Long count = baseMapper.selectCount(Wrappers.lambdaQuery(GithubUserScoreDO.class).eq(GithubUserScoreDO::getDelFlag, 0));

        if (type!= null) {
            scoreRankList = cacheUtil.getGithubUserScoreRankFromCache(nation, type);
            if (scoreRankList == null) {
                scoreRankList = baseMapper.findTopScoresByCountryNameAndType(size, nation, type);
                cacheUtil.setGithubUserScoreRankToCache(scoreRankList, nation, type);
            }
        } else {
            scoreRankList = cacheUtil.getGithubUserScoreRankFromCache(nation, null);
            if (scoreRankList == null) {
                scoreRankList = baseMapper.findTopScoresByCountryName(size, nation);
                cacheUtil.setGithubUserScoreRankToCache(scoreRankList, nation, null);
            }
        }
        // 返回结果
        return new RankRespDTO(scoreRankList, new ArrayList<>(cacheUtil.getCountries()), new ArrayList<>(cacheUtil.getTypes()),count);
    }

    @Override
    public List<String> getTypes() {
        return new ArrayList<>(cacheUtil.getTypes());
    }

    @Override
    public UserRankRespDTO getGithubUserRank(String login) {
        QueryWrapper<GithubUserScoreDO> queryWrapper = Wrappers.<GithubUserScoreDO>query()
                .eq("login", login);
        GithubUserScoreDO userScoreDO = this.getOne(queryWrapper);
        if (userScoreDO == null) {
            log.error("用户分数不存在");
            throw new ClientException(USER_SCORE_NOT_FOUND);
        }
        double totalScore = userScoreDO.getTotalScore();
        Integer githubUserRank = baseMapper.getGithubUserRank(totalScore);
        return new UserRankRespDTO(githubUserRank,totalScore);
    }
}