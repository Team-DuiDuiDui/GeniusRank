package com.nine.project.analyze.toolkit;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import static com.nine.project.analyze.constant.RedisCacheConstant.*;


/**
 * 缓存工具类
 */
@Component
@RequiredArgsConstructor
public class CacheUtil<T> {

    private final StringRedisTemplate stringRedisTemplate;
    private final RedisTemplate<String, String> redisTemplate;

    /**
     * 存入 Redis 缓存.
     *
     * @param key   Redis 键.
     * @param resp  Redis 值.
     * @param expireTime 过期时间.
     * @param timeUnit 时间单位.
     * @return 响应数据.
     */
    public T send2CacheHash(String key, T resp, long expireTime, TimeUnit timeUnit) {
        Map<String, Object> map = BeanUtil.beanToMap(resp, new HashMap<>(), CopyOptions.create()
                .setIgnoreNullValue(true)
                .setFieldValueEditor((fieldName, fieldValue) -> fieldValue!= null? fieldValue.toString() : null));
        stringRedisTemplate.opsForHash().putAll(key, map);
        stringRedisTemplate.expire(key, expireTime, timeUnit);
        return resp;
    }


    /**
     * 从 Redis 缓存中根据指定键获取哈希表数据。
     *
     * @param cacheKey Redis 键。
     * @return 包含 Redis 哈希表数据的 Map<Object, Object>，如果没有数据则返回空 Map。
     */
    public Map<Object, Object> getMapFromCacheHash(String cacheKey) {
        return stringRedisTemplate.opsForHash().entries(cacheKey);
    }

    /**
     * 注册国家
     */
    public void registerNation(String nation) {
        // 获取国家的计数器键
        String counterKey = NATION_COUNTER_KEY + nation;
        Long counter = redisTemplate.opsForValue().increment(counterKey);
        if (counter == null) {
            counter = 0L;
        }
        // 计算分数
        redisTemplate.opsForZSet().add(NATION_KEY, nation, counter);
    }

    /**
     * 获取所有国家
     * @return 排序后的所有国家
     */
    public Set<String> getCountries() {
        return redisTemplate.opsForZSet().reverseRange(NATION_KEY, 0, -1);
    }
}