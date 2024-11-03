package com.nine.project.analyze.dao.entity;


import com.baomidou.mybatisplus.annotation.TableName;
import com.nine.project.framework.database.base.BaseDO;
import lombok.Builder;
import lombok.Data;

/**
 * GitHub 用户分数表
 */
@Data
@Builder
@TableName("t_github_user_score")
public class GithubUserScoreDO extends BaseDO {
    /**
     * id
     */
    private Long id;

    /**
     * GitHub 用户名
     */
    private String login;

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
