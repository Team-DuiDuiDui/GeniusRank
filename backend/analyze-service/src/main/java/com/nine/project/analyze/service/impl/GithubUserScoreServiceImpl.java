package com.nine.project.analyze.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nine.project.analyze.dao.entity.GithubUserScoreDO;
import com.nine.project.analyze.dao.mapper.GithubUserScoreMapper;
import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;
import com.nine.project.analyze.service.GithubUserScoreService;
import com.nine.project.analyze.toolkit.GithubUserScoreCalculator;
import com.nine.project.framework.exception.ClientException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;


/**
 * 用户所在国家/地区猜测服务接口实现层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GithubUserScoreServiceImpl extends ServiceImpl<GithubUserScoreMapper, GithubUserScoreDO> implements GithubUserScoreService {

    @Override
    public GithubUserScoreRespDTO getGithubUserScore(String githubUserId) {

        GithubUserScoreDO userScoreDO = this.getOne(new QueryWrapper<GithubUserScoreDO>().eq("github_user_id", githubUserId));
        if (userScoreDO == null) {
            throw new ClientException("github_user_id NOT FIND");
        }

        return BeanUtil.copyProperties(userScoreDO, GithubUserScoreRespDTO.class);
    }

    @Override
    public GithubUserScoreRespDTO generateScore(GithubUserScoreReqDTO requestParams) {
        // 计算分数
        GithubUserScoreRespDTO scores = GithubUserScoreCalculator.calculate(requestParams);

        // 持久化用户分数
        GithubUserScoreDO userScoreDO = GithubUserScoreDO.builder()
                .githubUserId(requestParams.getUser().getGithub_user_id())
                .totalScore(scores.getTotalScore())
                .userScore(scores.getUserScore())
                .reposScore(scores.getReposScore())
                .prsScore(scores.getPrsScore())
                .issuesScore(scores.getIssuesScore())
                .build();
        boolean save = this.save(userScoreDO);
        if (!save) {
            throw new ClientException("USER SCORE PERSISTENCE FAILED");
        }

        // 封装响应数据
        GithubUserScoreRespDTO githubUserScoreRespDTO = BeanUtil.copyProperties(userScoreDO, GithubUserScoreRespDTO.class);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        String now = LocalDateTime.now().format(formatter);
        githubUserScoreRespDTO.setUpdateTime(LocalDateTime.parse(now, formatter));

        return githubUserScoreRespDTO;
    }
}
