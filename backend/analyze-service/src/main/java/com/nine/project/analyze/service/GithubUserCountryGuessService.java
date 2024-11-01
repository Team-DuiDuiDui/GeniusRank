package com.nine.project.analyze.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.nine.project.analyze.dao.entity.GithubUserCountryGuessDO;
import com.nine.project.analyze.dto.req.GithubUserCountryReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserCountryRespDTO;

/**
 * GitHub 用户所在国家/地区猜测接口层
 */
public interface GithubUserCountryGuessService extends IService<GithubUserCountryGuessDO> {

    /**
     * 根据类型获取用户所在国家/地区猜测
     * @param githubUserId GitHub 用户 ID
     * @return GithubUserCountryRespDTO 用户所在国家/地区猜测
     */
    GithubUserCountryRespDTO getGithubUserCountryGuessByGithubUserId(String githubUserId);


    /**
     * 创建用户所在国家/地区猜测
     * @param requestParams 用户所在国家/地区猜测数据
     */
    GithubUserCountryRespDTO create(GithubUserCountryReqDTO requestParams);
}
