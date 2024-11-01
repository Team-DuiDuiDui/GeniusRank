package com.nine.project.user.dto.req;

import lombok.Data;

/**
 * 用户登录请求参数
 */
@Data
public class UserLoginByOAuthDTO {

    /**
     * Github平台用户id
     */
    private Long githubUserId;

    /**
     * Github 用户名
     */
    private String login;

    /**
     * Github 登录 Token
     */
    private String accessToken;
}
