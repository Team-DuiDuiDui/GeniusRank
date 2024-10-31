package com.nine.project.user.dao.entity;

import lombok.Data;

/**
 * Github 用户信息
 */
@Data
public class GithubUserDO {
    /**
     * Github平台用户id
     */
    private String login;

    /**
     * Github 用户名
     */
    private String name;

    /**
     * 头像
     */
    private String avatar_url;

    /**
     * 邮箱
     */
    private String email;
}
