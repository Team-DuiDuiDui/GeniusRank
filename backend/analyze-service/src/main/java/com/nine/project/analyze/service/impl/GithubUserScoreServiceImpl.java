package com.nine.project.analyze.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nine.project.analyze.dao.entity.GithubUserDeveloperDO;
import com.nine.project.analyze.dao.entity.GithubUserScoreDO;
import com.nine.project.analyze.dao.mapper.GithubUserDevelopMapper;
import com.nine.project.analyze.dao.mapper.GithubUserScoreMapper;
import com.nine.project.analyze.dto.req.GithubDetailedScoreReqDTO;
import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;
import com.nine.project.analyze.service.GithubUserScoreService;
import com.nine.project.analyze.toolkit.CacheUtil;
import com.nine.project.analyze.toolkit.GithubDetailedScoreCalculator;
import com.nine.project.analyze.toolkit.GithubUserScoreCalculator;
import com.nine.project.analyze.toolkit.LanguageFrequencyCounter;
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
 * 用户所在国家/地区猜测服务接口实现层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GithubUserScoreServiceImpl extends ServiceImpl<GithubUserScoreMapper, GithubUserScoreDO> implements GithubUserScoreService {

    private final CacheUtil<GithubUserScoreRespDTO> cacheUtil;
    private final GithubUserDevelopMapper githubUserDevelopMapper;

    @Override
    public GithubUserScoreRespDTO getGithubUserScore(String githubUserId) {
        String cacheKey = USER_SCORE_KEY + githubUserId;

        // 从缓存中获取
        Map<Object, Object> cachedData = cacheUtil.getMapFromCacheHash(cacheKey);
        if (!cachedData.isEmpty()) {
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
        respDTO.setUpdateTime(Instant.now().getEpochSecond());

        // 存入缓存
        return cacheUtil.send2CacheHash(cacheKey, respDTO, USER_SCORE_EXPIRE_TIME, TimeUnit.SECONDS);
    }

    @Override
    public GithubUserScoreRespDTO generateScore(GithubUserScoreReqDTO requestParams) {
        String cacheKey = USER_SCORE_KEY + requestParams.getUser().getLogin();

        // 使用查询计数来判断记录是否存在
        LambdaQueryWrapper<GithubUserScoreDO> queryWrapper = Wrappers.lambdaQuery(GithubUserScoreDO.class)
                .eq(GithubUserScoreDO::getLogin, requestParams.getUser().getLogin())
                .eq(GithubUserScoreDO::getDelFlag, 0);
        long count = this.count(queryWrapper);
        boolean existsInDatabase = count > 0;

        // 计算分数
        GithubUserScoreRespDTO scores = GithubUserScoreCalculator.calculate(requestParams);

        // 封装持久化用户开发者领域
        List<String> topThreeLanguages = LanguageFrequencyCounter.getTopThreeLanguages(requestParams.getRepos());
        List<GithubUserDeveloperDO> developerDOList = new ArrayList<>();

        for (String language : topThreeLanguages) {
            GithubUserDeveloperDO developerDO = new GithubUserDeveloperDO();
            developerDO.setLogin(requestParams.getUser().getLogin());
            developerDO.setDeveloper_type(language);
            developerDOList.add(developerDO);
        }

        // 使用insertBatch方法批量插入数据
        if (!developerDOList.isEmpty()) {
            githubUserDevelopMapper.insert(developerDOList);
        }

        // 封装持久化用户分数
        GithubUserScoreDO userScoreDO = BeanUtil.copyProperties(scores, GithubUserScoreDO.class);
        userScoreDO.setLogin(requestParams.getUser().getLogin());

        // 如果存在，则更新。如果不存在，则添加
        return saveOrUpdate(existsInDatabase, userScoreDO, queryWrapper, cacheKey);
    }

    @Override
    public GithubUserScoreRespDTO generateScoreDetail(GithubDetailedScoreReqDTO requestParams) {
        String cacheKey = USER_SCORE_KEY + requestParams.getLogin();

        // 使用查询计数来判断记录是否存在
        LambdaQueryWrapper<GithubUserScoreDO> queryWrapper = Wrappers.lambdaQuery(GithubUserScoreDO.class)
                .eq(GithubUserScoreDO::getLogin, requestParams.getLogin())
                .eq(GithubUserScoreDO::getDelFlag, 0);
        long count = this.count(queryWrapper);
        boolean existsInDatabase = count > 0;

        // 计算分数
        GithubUserScoreRespDTO scores = GithubDetailedScoreCalculator.calculate(requestParams);

        // 封装持久化数据
        GithubUserScoreDO userScoreDO = BeanUtil.copyProperties(scores, GithubUserScoreDO.class);
        userScoreDO.setLogin(requestParams.getLogin());

        // 如果存在，则更新。如果不存在，则添加。并传入响应参数到缓存
        return saveOrUpdate(existsInDatabase, userScoreDO, queryWrapper, cacheKey);
    }

    /**
     * 根据是否存在数据库记录，决定是更新还是保存
     * @param existsInDatabase 是否存在数据库记录
     * @param userScoreDO 持久化数据
     * @param queryWrapper 查询条件
     * @param cacheKey 缓存key
     * @return 响应数据
     */
    private GithubUserScoreRespDTO saveOrUpdate(boolean existsInDatabase, GithubUserScoreDO userScoreDO, LambdaQueryWrapper<GithubUserScoreDO> queryWrapper, String cacheKey) {
        if (existsInDatabase) {
            this.update(userScoreDO, queryWrapper);
        } else{
            this.save(userScoreDO);
        }

        // 封装响应数据
        GithubUserScoreRespDTO respDTO = BeanUtil.copyProperties(userScoreDO, GithubUserScoreRespDTO.class);
        respDTO.setUpdateTime(Instant.now().getEpochSecond());

        // 存入缓存
        return cacheUtil.send2CacheHash(cacheKey, respDTO, USER_SCORE_EXPIRE_TIME, TimeUnit.SECONDS);
    }
}
