package com.nine.project.analyze.constant;

/**
 * Prompt 服务 Redis 缓存常量类
 */
public class RedisCacheConstant {

    /**
     * Prompt 默认有效时间
     */
    public static final long PROMPT_TEXT_EXPIRE_TIME = 7 * 24 * 60 * 60;

    public static final String PROMPT_TEXT_KEY = "general-project:prompt-text:";

    /**
     * 用户国家猜测有效时间
     */
    public static final long USER_COUNTRY_EXPIRE_TIME = 7 * 24 * 60 * 60;

    public static final String USER_COUNTRY_KEY = "general-project:user-country:";
}
