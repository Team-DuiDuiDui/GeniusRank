package com.nine.project.analyze.toolkit;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import com.alibaba.fastjson2.JSON;
import com.nine.project.analyze.dto.resp.GithubUserScoreRankRespDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.*;
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
     * 存入 Redis 哈希缓存.
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
     * 从缓存中获取 GitHub 用户分数排名列表。
     *
     * @param nations 国家名称列表，如果为 null 或空列表则不根据国家筛选。
     * @param types   用户类型列表，如果为 null 或空列表则不根据类型筛选。
     * @return GitHub 用户分数排名响应 DTO 列表，如果缓存中不存在则返回 null。
     */
    public List<GithubUserScoreRankRespDTO> getGithubUserScoreRankFromCache(List<String> nations, List<String> types, Integer size, Integer page) {
        String key;
        if (types!= null &&!types.isEmpty()) {
            key = String.format(SCORE_RANK_NATION_TYPE_KEY, nations, types, size, page);
        } else {
            key = String.format(SCORE_RANK_NATION_KEY, nations, size, page);
        }

        String json = redisTemplate.opsForValue().get(key);
        if (json == null) return null;

        return JSON.parseArray(json, GithubUserScoreRankRespDTO.class);
    }

    /**
     * 将 GitHub 用户分数排名列表存入缓存。
     *
     * @param scoreRankList GitHub 用户分数排名响应 DTO 列表。
     * @param nations       国家名称列表，如果为 null 或空列表则不根据国家筛选。
     * @param types         用户类型列表，如果为 null 或空列表则不根据类型筛选。
     */
    public void setGithubUserScoreRankToCache(List<GithubUserScoreRankRespDTO> scoreRankList, List<String> nations, List<String> types, Integer size, Integer page) {
        String key;
        if (types!= null &&!types.isEmpty()) {
            key = String.format(SCORE_RANK_NATION_TYPE_KEY, nations, types, size, page);
        } else {
            key = String.format(SCORE_RANK_NATION_KEY, nations, size, page);
        }

        redisTemplate.opsForValue().set(key, JSON.toJSONString(scoreRankList), USER_SCORE_RANK_EXPIRE_TIME, TimeUnit.SECONDS);
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

    /**
     * 注册开发者领域
     */
    public void registerType(String type) {
        // 获取国家的计数器键
        String counterKey = TYPE_COUNTER_KEY + type;
        Long counter = redisTemplate.opsForValue().increment(counterKey);
        if (counter == null) {
            counter = 0L;
        }
        // 计算分数
        redisTemplate.opsForZSet().add(TYPE_KEY, type, counter);
    }

    /**
     * 获取所有开发者领域
     * @return 排序后的所有开发者领域
     */
    public Set<String> getTypes() {
        return redisTemplate.opsForZSet().reverseRange(TYPE_KEY, 0, -1);
    }

    /**
     * 添加评分用户总数
     */
    public void addTotalScoredUser() {
        redisTemplate.opsForValue().increment(TOTAL_SCORED_USER_KEY);
    }

    /**
     * 获取评分用户总数
     * @return 总评分用户数
     */
    public Long getTotalScoredUser() {
        return Long.valueOf(Objects.requireNonNull(redisTemplate.opsForValue().get(TOTAL_SCORED_USER_KEY)));
    }
}