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
    private String githubUserId;


    /**
     * Github 登录 Token
     */
    private String accessToken;
}
