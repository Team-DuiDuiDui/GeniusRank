package com.nine.project.user.dto.req;

import lombok.Data;

/**
 * 用户忘记密码请求参数
 */
@Data
public class UserForgetPwdReqDTO {

    /**
     * 邮箱
     */
    private String email;

    /**
     * 验证码
     */
    private String code;

    /**
     * 新设置密码
     */
    private String newPassword;
}
