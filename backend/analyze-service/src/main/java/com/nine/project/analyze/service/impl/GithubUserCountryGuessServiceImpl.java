package com.nine.project.analyze.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nine.project.analyze.dao.entity.GithubUserCountryGuessDO;
import com.nine.project.analyze.dao.mapper.GithubUserCountryGuessMapper;
import com.nine.project.analyze.dto.req.GithubUserCountryReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserCountryRespDTO;
import com.nine.project.analyze.service.GithubUserCountryGuessService;
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
public class GithubUserCountryGuessServiceImpl extends ServiceImpl<GithubUserCountryGuessMapper, GithubUserCountryGuessDO> implements GithubUserCountryGuessService {

    private final StringRedisTemplate stringRedisTemplate;

    @Override
    public GithubUserCountryRespDTO getGithubUserCountryGuessByGithubUserId(String githubUserId) {
        String countryKey = USER_COUNTRY_KEY + githubUserId;

        // 从缓存中获取
        Map<Object, Object> cachedData = stringRedisTemplate.opsForHash().entries(countryKey);
        if (!cachedData.isEmpty()) {
            GithubUserCountryRespDTO respDTO = new GithubUserCountryRespDTO();
            return BeanUtil.fillBeanWithMap(cachedData, respDTO, true);
        }

        // 如果缓存中不存在，从数据库中查询
        LambdaQueryWrapper<GithubUserCountryGuessDO> queryWrapper = Wrappers.lambdaQuery(GithubUserCountryGuessDO.class)
                .eq(GithubUserCountryGuessDO::getGithubUserId, githubUserId)
                .eq(GithubUserCountryGuessDO::getDelFlag, 0);

        GithubUserCountryGuessDO githubUserCountryGuessDO = this.getOne(queryWrapper);

        // 存入缓存
        GithubUserCountryRespDTO githubUserCountryRespDTO = BeanUtil.copyProperties(githubUserCountryGuessDO, GithubUserCountryRespDTO.class);

        return getGithubUserCountryRespDTO(countryKey, githubUserCountryRespDTO);
    }

    @Override
    public GithubUserCountryRespDTO create(GithubUserCountryReqDTO requestParams) {
        String countryKey = USER_COUNTRY_KEY + requestParams.getGithubUserId();

        GithubUserCountryGuessDO githubUserCountryGuessDTO = BeanUtil.copyProperties(requestParams, GithubUserCountryGuessDO.class);

        // 使用查询计数来判断记录是否存在
        LambdaQueryWrapper<GithubUserCountryGuessDO> queryWrapper = Wrappers.lambdaQuery(GithubUserCountryGuessDO.class)
                .eq(GithubUserCountryGuessDO::getGithubUserId, requestParams.getGithubUserId())
                .eq(GithubUserCountryGuessDO::getDelFlag, 0);
        long count = this.count(queryWrapper);
        boolean existsInDatabase = count > 0;

        // 如果存在，则更新。如果不存在，则添加
        if (existsInDatabase) {
            this.update(githubUserCountryGuessDTO, queryWrapper);
        } else {
            this.save(githubUserCountryGuessDTO);
        }

        // 封装响应数据
        GithubUserCountryRespDTO respDTO = BeanUtil.copyProperties(githubUserCountryGuessDTO, GithubUserCountryRespDTO.class);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        respDTO.setUpdateTime(LocalDateTime.parse(LocalDateTime.now().format(formatter), formatter));

        // 存入缓存
        return getGithubUserCountryRespDTO(countryKey, respDTO);
    }

    /**
     * 存入 Redis 缓存
     * @param countryKey  Redis 键
     * @param respDTO  Redis 值
     * @return 响应数据
     */
    private GithubUserCountryRespDTO getGithubUserCountryRespDTO(String countryKey, GithubUserCountryRespDTO respDTO) {
        Map<String, Object> map = BeanUtil.beanToMap(respDTO , new HashMap<>(), CopyOptions.create()
                .setIgnoreNullValue(true)
                .setFieldValueEditor((fieldName, fieldValue) -> fieldValue != null ? fieldValue.toString() : null));

        stringRedisTemplate.opsForHash().putAll(countryKey, map);
        stringRedisTemplate.expire(countryKey, USER_COUNTRY_EXPIRE_TIME, TimeUnit.SECONDS);
        return respDTO;
    }
}
