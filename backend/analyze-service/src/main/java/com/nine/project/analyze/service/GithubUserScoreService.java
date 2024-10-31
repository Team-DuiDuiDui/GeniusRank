package com.nine.project.analyze.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.nine.project.analyze.dao.entity.GithubUserScoreDO;
import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;

/**
 * GitHub 用户分数接口层
 */
public interface GithubUserScoreService extends IService<GithubUserScoreDO> {

    /**
     * 查询对于 githubUserId 的用户分数接口
     * @param githubUserId GitHub 用户 ID
     * @return GithubUserScoreRespDTO 用户分数
     */
    GithubUserScoreRespDTO getGithubUserScore(String githubUserId);

    /**
     * 创建用户数接口
     * @param requestParams 用户所在国家/地区猜测数据
     * @return GithubUserScoreRespDTO 用户分数
     */
    GithubUserScoreRespDTO generateScore(GithubUserScoreReqDTO requestParams);
}
