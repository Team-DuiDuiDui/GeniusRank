package com.nine.project.user.common.constant;

/**
 *  布隆过滤器常量
 */
public class RBloomFilterConstant {

    /**
     * 期望插入的元素数量
     */
    public static final int EXPECTED_INSERTIONS = 100000;

    /**
     * 误判率
     */
    public static final double FPP = 0.001;

    /**
     * 用户名布隆过滤器
     */
    public static final String USERNAME_BLOOM_FILTER = "general-project:usernameRegisterBloomFilter";

    /**
     * 邮箱布隆过滤器
     */
    public static final String EMAIL_BLOOM_FILTER = "general-project:emailRegisterBloomFilter";
}
