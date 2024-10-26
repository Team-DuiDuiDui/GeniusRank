package com.nine.project.user.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 用户注册接口返回响应
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterRespDTO {

    /**
     * 用户Token
     */
    private String token;
}
