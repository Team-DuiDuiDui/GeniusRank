package com.nine.project.user.dto.resp;


import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.nine.project.user.common.serialize.EmailDesensitizationSerializer;
import lombok.Data;

/**
 * 用户返回参数响应
 */
@Data
public class UserDesensitizedRespDTO {
    /**
     * id
     */
    private Long id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 脱敏邮箱信息
     */
    @JsonSerialize(using = EmailDesensitizationSerializer.class)
    private String email;

    /**
     * 用户头像
     */
    private String avatar;
}
