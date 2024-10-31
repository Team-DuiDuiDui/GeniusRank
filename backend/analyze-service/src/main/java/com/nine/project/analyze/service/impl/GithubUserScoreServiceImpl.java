package com.nine.project.analyze.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nine.project.analyze.dao.entity.GithubUserScoreDO;
import com.nine.project.analyze.dao.mapper.GithubUserScoreMapper;
import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;
import com.nine.project.analyze.service.GithubUserScoreService;
import com.nine.project.analyze.toolkit.GithubUserScoreCalculator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import static com.nine.project.analyze.constant.RedisCacheConstant.*;


/**
 * 用户所在国家/地区猜测服务接口实现层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GithubUserScoreServiceImpl extends ServiceImpl<GithubUserScoreMapper, GithubUserScoreDO> implements GithubUserScoreService {

    private final StringRedisTemplate stringRedisTemplate;

    @Override
    public GithubUserScoreRespDTO getGithubUserScore(String githubUserId) {
        String cacheKey = USER_SCORE_KEY + githubUserId;

        // 从缓存中获取
        Map<Object, Object> cachedData = stringRedisTemplate.opsForHash().entries(cacheKey);
        if (!cachedData.isEmpty()) {
            return BeanUtil.fillBeanWithMap(cachedData, GithubUserScoreRespDTO.builder().build(), true);
        }

        // 如果缓存中不存在，从数据库中查询
        LambdaQueryWrapper<GithubUserScoreDO> queryWrapper = Wrappers.lambdaQuery(GithubUserScoreDO.class)
                .eq(GithubUserScoreDO::getGithubUserId, githubUserId)
                .eq(GithubUserScoreDO::getDelFlag, 0);

        GithubUserScoreDO userScoreDO = this.getOne(queryWrapper);

        // 存入缓存
        GithubUserScoreRespDTO githubUserScoreRespDTO = BeanUtil.copyProperties(userScoreDO, GithubUserScoreRespDTO.class);

        return send2Cache(cacheKey, githubUserScoreRespDTO);
    }

    @Override
    public GithubUserScoreRespDTO generateScore(GithubUserScoreReqDTO requestParams) {
        String cacheKey = USER_SCORE_KEY + requestParams.getUser().getGithub_user_id();

        // 使用查询计数来判断记录是否存在
        LambdaQueryWrapper<GithubUserScoreDO> queryWrapper = Wrappers.lambdaQuery(GithubUserScoreDO.class)
                .eq(GithubUserScoreDO::getGithubUserId, requestParams.getUser().getGithub_user_id())
                .eq(GithubUserScoreDO::getDelFlag, 0);
        long count = this.count(queryWrapper);
        boolean existsInDatabase = count > 0;

        // 计算分数
        GithubUserScoreRespDTO scores = GithubUserScoreCalculator.calculate(requestParams);

        // 封装持久化数据
        GithubUserScoreDO userScoreDO = BeanUtil.copyProperties(scores, GithubUserScoreDO.class);
        userScoreDO.setGithubUserId(requestParams.getUser().getGithub_user_id());

        // 如果存在，则更新。如果不存在，则添加
        if (existsInDatabase) {
            this.update(userScoreDO, queryWrapper);
        } else{
            this.save(userScoreDO);
        }

        // 封装响应数据
        GithubUserScoreRespDTO respDTO = BeanUtil.copyProperties(userScoreDO, GithubUserScoreRespDTO.class);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        respDTO.setUpdateTime(LocalDateTime.parse(LocalDateTime.now().format(formatter), formatter));

        // 存入缓存
        return send2Cache(cacheKey, respDTO);
    }

    /**
     * 存入 Redis 缓存
     * @param key  Redis 键
     * @param respDTO  Redis 值
     * @return 响应数据
     */
    private GithubUserScoreRespDTO send2Cache(String key, GithubUserScoreRespDTO respDTO) {
        Map<String, Object> map = BeanUtil.beanToMap(respDTO , new HashMap<>(), CopyOptions.create()
                .setIgnoreNullValue(true)
                .setFieldValueEditor((fieldName, fieldValue) -> fieldValue != null ? fieldValue.toString() : null));

        stringRedisTemplate.opsForHash().putAll(key, map);
        stringRedisTemplate.expire(key, USER_SCORE_EXPIRE_TIME, TimeUnit.SECONDS);
        return respDTO;
    }
}
