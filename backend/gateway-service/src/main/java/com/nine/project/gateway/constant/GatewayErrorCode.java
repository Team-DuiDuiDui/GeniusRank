package com.nine.project.gateway.constant;

/**
 * 基础错误码定义，由组件包抽象基础错误码
 */
public enum GatewayErrorCode {
    // ========== 二级宏观错误码 Token 异常 ==========
    TOKEN_ERROR("A0400", "Token 异常"),
    TOKEN_NULL_ERROR("A0401", "Token 为空"),
    TOKEN_EXPIRED_ERROR("A0402", "Token 过期或者失效");

    private final String code;

    private final String message;

    GatewayErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String code() {
        return code;
    }

    public String message() {
        return message;
    }
}