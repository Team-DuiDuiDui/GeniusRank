package com.nine.project.gateway.constant;

/**
 * 用户服务 Redis 缓存常量类
 */
public class RedisCacheConstant {

    /**
     * 用户登录token默认有效时间
     */
    public static final long USER_LOGIN_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60;

    /**
     * 用户登录缓存标识
     */
    public static final String USER_LOGIN_KEY = "general-project:login:";
}
