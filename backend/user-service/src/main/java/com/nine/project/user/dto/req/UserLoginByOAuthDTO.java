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
     * 用户名
     */
    private String username;

    /**
     * 头像
     */
    private String avatar;

    /**
     * 邮箱
     */
    private String email;
}
