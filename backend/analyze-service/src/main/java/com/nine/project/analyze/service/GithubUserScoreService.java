package com.nine.project.analyze.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.nine.project.analyze.dao.entity.GithubUserScoreDO;
import com.nine.project.analyze.dto.req.GithubDetailedScoreReqDTO;
import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRankRespDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;
import com.nine.project.analyze.dto.resp.RankRespDTO;
import com.nine.project.analyze.dto.resp.UserRankRespDTO;

import java.util.List;

/**
 * GitHub 用户分数接口层
 */
public interface GithubUserScoreService extends IService<GithubUserScoreDO> {

    /**
     * 根据 login 查询用户分数和排名接口
     * @param login GitHub 用户名
     * @return GithubUserScoreRespDTO 用户分数
     */
    GithubUserScoreRespDTO getGithubUserScore(String login);

    /**
     * 简单创建用户分数接口
     * @param requestParams 请求参数
     * @return GithubUserScoreRespDTO 用户分数
     */
    GithubUserScoreRespDTO generateScore(GithubUserScoreReqDTO requestParams);

    /**
     * 详细创建用户分数接口
     * @param requestParams 请求参数
     * @return GithubUserScoreRespDTO 用户分数
     */
    GithubUserScoreRespDTO generateScoreDetail(GithubDetailedScoreReqDTO requestParams);

    /**
     * 获取 GitHub 用户分数排名接口
     * @param size 排名数量
     * @param page 页面数量
     * @param type 排名类型
     * @param nation 国家
     * @return List<GithubUserScoreRespDTO> 用户分数
     */
    RankRespDTO getGithubUserScoreRank(Integer size, Integer page, List<String> nation, List<String> type);

    /**
     * 获取所有已存在的国家
     * @return List<String> 国家列表
     */
    List<String> getTypes();

    /**
     * 获取用户分数接口排行榜（无需登录）
     */
    UserRankRespDTO getGithubUserRank(String login);
}
