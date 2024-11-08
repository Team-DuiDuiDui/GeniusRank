package com.nine.project.analyze.dto.resp;

import lombok.Builder;
import lombok.Data;


/**
 * Github 用户得分响应
 */
@Data
@Builder
public class GithubUserScoreRespDTO {

    /**
     * Github 用户总分
     */
    private double totalScore;

    /**
     * 昵称
     */
    private String name;

    /**
     * 头像
     */
    private String avatarUrl;

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

    /**
     * 用户排名
     */
    private Integer rank;

    /**
     * 更新时间
     */
    private long updateTime;
}
