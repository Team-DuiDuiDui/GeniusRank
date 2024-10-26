package com.nine.project.user.mq.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 验证码发送事件
 */
@Data
@Builder
@AllArgsConstructor
public class VerificationCodeEvent implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    /**
     * 用户邮箱
     */
    private String email;

    /**
     * 有效时长为 10 分钟验证码
     */
    private String code;
}