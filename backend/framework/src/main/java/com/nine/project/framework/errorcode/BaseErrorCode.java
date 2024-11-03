package com.nine.project.framework.errorcode;

/**
 * 基础错误码定义，由组件包抽象基础错误码
 */
public enum BaseErrorCode implements IErrorCode {

    // ========== 一级宏观错误码 客户端错误 ==========
    CLIENT_ERROR("A0001", "用户端错误"),

    // ========== 二级宏观错误码 用户注册错误 ==========
    USER_REGISTER_ERROR("A0100", "用户注册错误"),
    EMAIL_FORMAT_ERROR("A0101", "邮箱格式不正确"),
    USER_NAME_FORMAT_ERROR("A0102", "用户名格式不正确"),
    PASSWORD_FORMAT_ERROR("A0103", "密码格式不正确"),
    USER_NAME_EXIST_ERROR("A0104", "用户名已存在"),
    EMAIL_EXIST_ERROR("A0105", "邮箱已存在"),
    USER_EXIST_ERROR("A0106", "邮箱或者用户名已存在"),

    // ========== 二级宏观错误码 用户登录错误 ==========
    USER_LOGIN_ERROR("A0200", "用户登录错误"),
    EMAIL_NOT_EXIST_ERROR("A0201", "邮箱不存在"),
    USER_NAME_NOT_EXIST_ERROR("A0202", "用户名不存在"),
    USER_NOT_FOUND_ERROR("A0203", "用户不存在"),
    PASSWORD_VERIFY_ERROR("A0204", "密码校验失败"),
    USER_OAUTH_ERROR("A0205", "用户 OAuth 验证失败"),

    // ========== 二级宏观错误码 验证码错误 ==========
    VERIFICATION_CODE_ERROR("A0300", "验证码错误"),
    VERIFICATION_CODE_SENT("A0301", "验证码已发送，请勿重复发送"),
    VERIFICATION_CODE_INVALID("A0302", "验证码错误"),

    // ========== 二级宏观错误码 Token 异常 ==========
    TOKEN_ERROR("A0400", "Token 异常"),
    TOKEN_NULL_ERROR("A0401", "Token 为空"),
    TOKEN_EXPIRED_ERROR("A0402", "Token 过期或者失效"),

    // ========== 一级宏观错误码 服务端出错 ==========
    SERVER_ERROR("B0001", "服务端出错"),

    // ========== 二级宏观错误码 用户服务系统执行出错 ==========
    USER_SERVICE_ERROR("B0100", "用户服务系统执行出错"),
    USER_RECORD_ADD_ERROR("B0101", "用户记录新增出错"),
    USER_RECORD_QUERY_ERROR("B0102", "用户记录查询出错"),
    USER_RECORD_UPDATE_ERROR("B0103", "用户记录更新失败"),
    USER_LOGIN_OUT_ERROR("B0104", "用户登出失败"),

    // ========== 二级宏观错误码 xxx服务系统执行出错 ==========
    XXX_SERVICE_ERROR("B0110", "xxx服务系统执行出错"),

    // ========== 二级宏观错误码 邮箱服务系统执行出错 ==========
    USER_COUNTRY_NOT_FOUND("B0200", "用户国家未查询到"),
    USER_SCORE_NOT_FOUND("B0200", "用户分数未查询到"),

    // ========== 二级宏观错误码 系统执行超时 ==========
    SYSTEM_TIMEOUT_ERROR("B0300", "系统执行超时"),

    // ========== 二级宏观错误码 系统容灾功能被触发 ==========
    SYSTEM_DISASTER_RECOVERY("B0400", "系统容灾功能被触发"),

    // ========== 二级宏观错误码 系统资源异常 ==========
    SYSTEM_RESOURCE_ERROR("B0500", "系统资源异常"),

    // ========== 一级宏观错误码 调用第三方服务出错 ==========
    REMOTE_ERROR("C0001", "调用第三方服务出错"),

    // ========== 二级宏观错误码 中间件服务出错 ==========
    MIDDLEWARE_ERROR("C0100", "中间件服务出错"),
    SMS_SERVICE_ERROR("C0101", "短信服务出错"),
    MESSAGE_QUEUE_ERROR("C0102", "消息队列出错"),
    OSS_SERVICE_ERROR("C0103", "对象存储服务出错"),
    AI_SERVICE_ERROR("C0104", "AI 服务出错"),

    // ========== 二级宏观错误码 RPC服务出错 ==========
    RPC_SERVICE_ERROR("C0110", "RPC服务出错"),
    RPC_SERVICE_NOT_FOUND("C0111", "RPC服务未找到"),
    RPC_SERVICE_NOT_REGISTERED("C0112", "RPC服务未注册");

    private final String code;

    private final String message;

    BaseErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public String code() {
        return code;
    }

    @Override
    public String message() {
        return message;
    }
}