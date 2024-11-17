package com.nine.project.analyze.dao.entity;


import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * GitHub 开发者领域
 */
@Data
@TableName("t_github_user_developer_type")
public class GithubUserDeveloperDO {
    /**
     * id
     */
    private Long id;

    /**
     * GitHub 用户名
     */
    private String login;

    /**
     * 开发者领域（语言）
     */
    private String developer_type;
}
