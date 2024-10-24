package com.nine.project.user.dto.req;

import lombok.Data;

/**
 * 用户登录请求参数
 */
@Data
public class UserLoginReqDTO {

    /**
     * 用户名或邮箱
     */
    private String usernameOrEmail;


    /**
     * 密码
     */
    private String password;
}
