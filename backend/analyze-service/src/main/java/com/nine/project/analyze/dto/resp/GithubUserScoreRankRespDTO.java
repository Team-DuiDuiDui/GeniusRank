package com.nine.project.analyze.dto.resp;

import lombok.Builder;
import lombok.Data;

import java.util.List;


/**
 * Github 用户得分响应
 */
@Data
@Builder
public class GithubUserScoreRankRespDTO {
    /**
     * Github 用户名
     */
    private String login;

    /**
     * 昵称
     */
    private String name;

    /**
     * 头像
     */
    private String avatar_url;

    /**
     * 用户所在国家/地区 iso 代码
     */
    private String country_iso;

    /**
     * Github 用户总分
     */
    private double totalScore;

    /**
     * Github 用户基础数据得分
     */
    private double userScore;

    /**
     * Github 用户仓库数据得分
     */
    private double reposScore;

    /**
     * Github 用户 prs 数据得分
     */
    private double prsScore;

    /**
     * Github 用户 issues 数据得分
     */
    private double issuesScore;
}
