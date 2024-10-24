package com.nine.project.user.dto.req;

import lombok.Data;

/**
 * 用户登录请求参数
 */
@Data
public class UserLoginByCodeReqDTO {

    /**
     * 邮箱
     */
    private String email;


    /**
     * 验证码
     */
    private String code;
}
