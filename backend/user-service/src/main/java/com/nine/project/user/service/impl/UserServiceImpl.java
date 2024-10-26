package com.nine.project.user.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nine.project.framework.biz.user.UserContext;
import com.nine.project.framework.errorcode.BaseErrorCode;
import com.nine.project.framework.exception.ClientException;
import com.nine.project.framework.exception.ServiceException;
import com.nine.project.user.dao.entity.UserDO;
import com.nine.project.user.dao.mapper.UserMapper;
import com.nine.project.user.dto.req.UserUpdateReqDTO;
import com.nine.project.user.dto.resp.UserRespDTO;
import com.nine.project.user.service.UserService;
import com.nine.project.user.toolkit.VerifyUserParamUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RBloomFilter;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static com.nine.project.framework.errorcode.BaseErrorCode.*;
import static com.nine.project.user.common.constant.RedisCacheConstant.USER_LOGIN_KEY;


/**
 * 用户服务接口实现层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, UserDO> implements UserService {

    private final RBloomFilter<String> usernameCachePenetrationBloomFilter;
    private final StringRedisTemplate stringRedisTemplate;

    @Override
    public UserRespDTO getUserInfo() {
        String token = UserContext.getToken();

        // 从 redis 中查询用户信息
        String tokenKey = USER_LOGIN_KEY + token;
        Map<Object, Object> userMap = stringRedisTemplate.opsForHash().entries(tokenKey);
        if (CollUtil.isEmpty(userMap)) {
            // 如果缓存中不存在，从数据库中查询用户信息
            String userId = UserContext.getUserId();
            UserDO user = baseMapper.selectOne(Wrappers.<UserDO>lambdaQuery().eq(UserDO::getId, userId));
            if (user == null) {
                throw new ServiceException(USER_RECORD_QUERY_ERROR);
            }
            return BeanUtil.copyProperties(user, UserRespDTO.class);
        }

        // 将 map 转换为响应对象
        UserRespDTO result = new UserRespDTO();
        BeanUtil.fillBeanWithMap(userMap, result, true);
        return result;
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void update(UserUpdateReqDTO requestParam) {
        // 校验要更新的字段
        BaseErrorCode verifiedErrorCode = VerifyUserParamUtil.verifyUpdate(requestParam);
        if (verifiedErrorCode != null) {
            throw new ClientException(verifiedErrorCode);
        }

        // 判断要更改的用户名是否已经存在
        if (requestParam.getUsername() != null && usernameCachePenetrationBloomFilter.contains(requestParam.getUsername())) {
            throw new ClientException(USER_NAME_EXIST_ERROR);
        }

        // 根据用户 ID 查询用户信息
        String userId = UserContext.getUserId();
        UserDO user = baseMapper.selectById(userId);
        if (user == null) {
            throw new ServiceException(USER_RECORD_QUERY_ERROR);
        }

        // 判断旧密码是否和数据库中的相同
        if (requestParam.getPassword() != null && !Objects.equals(requestParam.getOldPassword(), user.getPassword())) {
            throw new ClientException(PASSWORD_VERIFY_ERROR);
        }

        // 进行逐个字段的更新
        if (requestParam.getUsername() != null) {
            user.setUsername(requestParam.getUsername());
        }

        if (requestParam.getPassword() != null) {
            user.setPassword(requestParam.getPassword());
        }

        if (requestParam.getAvatar() != null) {
            user.setAvatar(requestParam.getAvatar());
        }

        // 保存更新到数据库
        baseMapper.updateById(user);
        usernameCachePenetrationBloomFilter.add(user.getUsername());

        // 更新 Redis 缓存
        updateRedisCache(requestParam);
    }

    @Override
    public Boolean checkLogin() {
        String token = UserContext.getToken();
        return stringRedisTemplate.hasKey(USER_LOGIN_KEY + token);
    }

    @Override
    public void logout() {
        if (checkLogin()) {
            String token = UserContext.getToken();
            stringRedisTemplate.delete(USER_LOGIN_KEY + token);
            return;
        }

        throw new ServiceException(USER_LOGIN_OUT_ERROR);
    }

    private void updateRedisCache(UserUpdateReqDTO requestParam) {
        String tokenKey = USER_LOGIN_KEY + UserContext.getToken();

        // 更新 Redis 中的 userMap
        Map<String, Object> userMap = new HashMap<>();

        if (requestParam.getUsername() != null) {
            userMap.put("username", requestParam.getUsername());
        }

        if (requestParam.getAvatar() != null) {
            userMap.put("avatar", requestParam.getAvatar());
        }

        // 仅在 userMap 不为空时才更新 Redis
        if (!userMap.isEmpty()) {
            stringRedisTemplate.opsForHash().putAll(tokenKey, userMap);
        }
    }
}
