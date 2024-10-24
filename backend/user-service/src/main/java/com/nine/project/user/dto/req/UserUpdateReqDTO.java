package com.nine.project.user.dto.req;


import lombok.Data;

/**
 * 用户注册请求参数
 */
@Data
public class UserUpdateReqDTO {
    /**
     * 用户名
     */
    private String username;

    /**
     * 原始密码
     */
    private String oldPassword;

    /**
     * 密码
     */
    private String password;

    /**
     * 头像
     */
    private String avatar;
}
