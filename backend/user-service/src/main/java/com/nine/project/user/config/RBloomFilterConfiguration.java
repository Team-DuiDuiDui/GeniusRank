package com.nine.project.user.config;

import org.redisson.api.RBloomFilter;
import org.redisson.api.RedissonClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static com.nine.project.user.common.constant.RBloomFilterConstant.*;

/**
 * 布隆过滤器配置
 * 该配置类用于定义和初始化布隆过滤器Bean，以便在应用程序中用于缓存穿透防护等场景。
 */
@Configuration
public class RBloomFilterConfiguration {

    /**
     * 创建一个用于防止用户注册时查询数据库的布隆过滤器Bean
     *
     * @param redissonClient Redisson客户端，用于与Redis进行交互
     * @return 配置好的RBloomFilter实例
     */
    @Bean
    public RBloomFilter<String> usernameCachePenetrationBloomFilter(RedissonClient redissonClient) {
        // 创建一个布隆过滤器实例
        RBloomFilter<String> cachePenetrationBloomFilter = redissonClient.getBloomFilter(USERNAME_BLOOM_FILTER);

        // 初始化布隆过滤器，预计插入 EXPECTED_INSERTIONS 个元素，并设置误报率为 FPP
        // 注意：这些参数应该根据您的实际需求进行调整
        cachePenetrationBloomFilter.tryInit(EXPECTED_INSERTIONS, FPP);

        // 返回配置好的布隆过滤器实例
        return cachePenetrationBloomFilter;
    }

    /**
     * 创建一个用于防止用户注册时查询数据库的布隆过滤器Bean
     *
     * @param redissonClient Redisson客户端，用于与Redis进行交互
     * @return 配置好的RBloomFilter实例
     */
    @Bean
    public RBloomFilter<String> userEmailCachePenetrationBloomFilter(RedissonClient redissonClient) {
        // 创建一个布隆过滤器实例
        RBloomFilter<String> cachePenetrationBloomFilter = redissonClient.getBloomFilter(EMAIL_BLOOM_FILTER);

        // 初始化布隆过滤器，预计插入 EXPECTED_INSERTIONS 个元素，并设置误报率为 FPP
        // 注意：这些参数应该根据您的实际需求进行调整
        cachePenetrationBloomFilter.tryInit(EXPECTED_INSERTIONS, FPP);

        // 返回配置好的布隆过滤器实例
        return cachePenetrationBloomFilter;
    }

}