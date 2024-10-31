package com.nine.project.user.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.bean.copier.CopyOptions;
import cn.hutool.core.lang.UUID;
import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nine.project.framework.errorcode.BaseErrorCode;
import com.nine.project.framework.exception.ClientException;
import com.nine.project.framework.exception.ServiceException;
import com.nine.project.user.dao.entity.GithubUserDO;
import com.nine.project.user.dao.entity.UserDO;
import com.nine.project.user.dao.entity.UserInfoDO;
import com.nine.project.user.dao.mapper.UserMapper;
import com.nine.project.user.dto.req.*;
import com.nine.project.user.dto.resp.UserLoginRespDTO;
import com.nine.project.user.dto.resp.UserRegisterRespDTO;
import com.nine.project.user.mq.event.VerificationCodeEvent;
import com.nine.project.user.mq.produce.VerificationCodeProducer;
import com.nine.project.user.service.LoginService;
import com.nine.project.user.toolkit.RegexUtil;
import com.nine.project.user.toolkit.VerifyUserParamUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RBloomFilter;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import static com.nine.project.framework.errorcode.BaseErrorCode.*;
import static com.nine.project.user.common.constant.RedisCacheConstant.*;
import static com.nine.project.user.common.constant.UserConstant.USER_DEFAULT_AVATAR;

/**
 * 用户登录接口实现层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LoginServiceImpl extends ServiceImpl<UserMapper, UserDO> implements LoginService {

    private final RBloomFilter<String> usernameCachePenetrationBloomFilter;
    private final RBloomFilter<String> userEmailCachePenetrationBloomFilter;
    private final RedissonClient redissonClient;
    private final StringRedisTemplate stringRedisTemplate;
    private final VerificationCodeProducer verificationCodeProducer;
    private final RestTemplate restTemplate;

    @Value("${spring.mail.enable}")
    private Boolean VerificationCodeEnable; // 是否开启邮箱验证码

    @Override
    public void sendCode2Email(String sendTo) {
        // 校验邮箱
        if (RegexUtil.isEmailInvalid(sendTo)) {
            throw new ClientException(EMAIL_FORMAT_ERROR);
        }

        // 使用该用户十分钟内是否重复发送验证码
        String code = stringRedisTemplate.opsForValue().get(EMAIL_CODE_KEY + sendTo);
        if (!StrUtil.isEmpty(code)) {
            throw new ClientException(VERIFICATION_CODE_SENT);
        }

        // 生成六位随机数作为验证码
        code = RandomUtil.randomNumbers(6);

        // 将验证码存入redis，有效期为 10 分钟
        log.info("用户 {} 的验证码为：{}", sendTo, code);
        stringRedisTemplate.opsForValue().set(EMAIL_CODE_KEY + sendTo, code, 10, TimeUnit.MINUTES);

        // 使用消息队列异步发送验证码
        verificationCodeProducer.sendMessage(new VerificationCodeEvent(sendTo, code));
    }

    @Override
    public Boolean hasEmail(String username) {
        return userEmailCachePenetrationBloomFilter.contains(username);
    }

    @Override
    public Boolean hasUsername(String username) {
        return usernameCachePenetrationBloomFilter.contains(username);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public UserRegisterRespDTO register(UserRegisterReqDTO requestParam) {
        // 校验邮箱，用户名，密码格式
        BaseErrorCode verifiedErrorCode = VerifyUserParamUtil.verifyRegister(requestParam);
        if (verifiedErrorCode != null) {
            throw new ClientException(verifiedErrorCode);
        }

        // 校验邮箱验证码
        String code = stringRedisTemplate.opsForValue().get(EMAIL_CODE_KEY + requestParam.getEmail());
        if (VerificationCodeEnable && !Objects.equals(code, requestParam.getCode())) {
            throw new ClientException(VERIFICATION_CODE_INVALID);
        }

        // 判断邮箱是否已经存在
        if (hasUsername(requestParam.getUsername())) {
            throw new ClientException(EMAIL_EXIST_ERROR);
        }

        // 判断用户名是否已经存在
        if (hasEmail(requestParam.getEmail())) {
            throw new ClientException(USER_NAME_EXIST_ERROR);
        }

        // 加分布式锁(多个相同 username 请求，只有一个可以执行)
        RLock lock = redissonClient.getLock(LOCK_USER_REGISTER_KEY + requestParam.getUsername());
        if (!lock.tryLock()) {
            throw new ClientException(USER_NAME_EXIST_ERROR);
        }

        // 执行注册逻辑
        try {
            UserDO userDO = BeanUtil.toBean(requestParam, UserDO.class);
            userDO.setAvatar(USER_DEFAULT_AVATAR); // 给用户设置默认头像

            // 注册
            int inserted = baseMapper.insert(userDO);
            if (inserted < 1) {
                throw new ServiceException(USER_RECORD_ADD_ERROR);
            }
            usernameCachePenetrationBloomFilter.add(requestParam.getUsername());
            userEmailCachePenetrationBloomFilter.add(requestParam.getEmail());
            return new UserRegisterRespDTO(generateToken(userDO));
        } catch (DuplicateKeyException ex) {
            throw new ClientException(USER_EXIST_ERROR);
        } finally {
            lock.unlock();
        }
    }

    @Override
    public UserLoginRespDTO loginByCode(UserLoginByCodeReqDTO requestParam) {
        // 通过邮箱验证码并拿到用户信息
        UserDO userDO = Verification4GetUser(requestParam.getEmail(), requestParam.getCode());

        // 返回token登录凭证
        return new UserLoginRespDTO(generateToken(userDO));
    }

    @Override
    public UserLoginRespDTO login(UserLoginReqDTO requestParam) {
        // 判断登录账号是使用的邮箱还是用户名
        boolean mailFlag = !RegexUtil.isEmailInvalid(requestParam.getUsernameOrEmail());
        UserDO user;

        if (mailFlag) {
            // 根据邮箱+密码查询用户信息
            if (!hasEmail(requestParam.getUsernameOrEmail())) {
                throw new ClientException(EMAIL_NOT_EXIST_ERROR);
            }

            LambdaQueryWrapper<UserDO> queryWrapper = Wrappers.lambdaQuery(UserDO.class)
                    .eq(UserDO::getEmail, requestParam.getUsernameOrEmail())
                    .eq(UserDO::getPassword, requestParam.getPassword());
            user = baseMapper.selectOne(queryWrapper);
        } else {
            // 根据用户名+密码查询用户信息
            if (!hasUsername(requestParam.getUsernameOrEmail())) {
                throw new ClientException(USER_NOT_FOUND_ERROR);
            }

            LambdaQueryWrapper<UserDO> queryWrapper = Wrappers.lambdaQuery(UserDO.class)
                    .eq(UserDO::getUsername, requestParam.getUsernameOrEmail())
                    .eq(UserDO::getPassword, requestParam.getPassword());
            user = baseMapper.selectOne(queryWrapper);
        }

        // 如果没有查询到用户，则密码出错
        if (user == null) {
            throw new ClientException(PASSWORD_VERIFY_ERROR);
        }

        // 返回token登录凭证
        return new UserLoginRespDTO(generateToken(user));
    }

    @Override
    public UserLoginRespDTO forgetPassword(UserForgetPwdReqDTO requestParam) {
        // 通过邮箱验证码并拿到用户信息
        UserDO userDO = Verification4GetUser(requestParam.getEmail(), requestParam.getCode());

        // 更新密码
        userDO.setPassword(requestParam.getNewPassword());
        int updated = baseMapper.updateById(userDO);
        if (updated < 1) {
            throw new ServiceException(USER_RECORD_UPDATE_ERROR);
        }

        // 返回token登录凭证
        return new UserLoginRespDTO(generateToken(userDO));
    }

    @Override
    public UserLoginRespDTO loginByOAuth(UserLoginByOAuthDTO requestParam) {
        // 封装请求到 Github 验证用户身份并得到用户信息
        MultiValueMap<String, Object> headers = new LinkedMultiValueMap<>();
        headers.add("Authorization", "Bearer " + requestParam.getAccessToken());
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(headers);

        // 发送请求并验证用户身份
        ResponseEntity<String> response = restTemplate.exchange("https://api.github.com/users/" + requestParam.getGithubUserId(), HttpMethod.GET, entity, String.class);
        GithubUserDO userInfo = JSONUtil.toBean(response.getBody(), GithubUserDO.class);
        if (response.getStatusCode() != HttpStatus.OK || !userInfo.getLogin().equals(requestParam.getGithubUserId())) {
            throw new ClientException(USER_OAUTH_ERROR);
        }

        // 查询用户信息
        UserDO user = baseMapper.selectOne(Wrappers.lambdaQuery(UserDO.class).eq(UserDO::getGithub_user_id, requestParam.getGithubUserId()));
        if (user != null) {
            return new UserLoginRespDTO(generateToken(user));
        }

        // 执行注册逻辑
        try {
            UserDO userDO = UserDO.builder()
                    .email(userInfo.getEmail())
                    .github_user_id(userInfo.getLogin())
                    .avatar(userInfo.getAvatar_url())
                    .username(userInfo.getName())
                    .build();

            // 注册
            int inserted = baseMapper.insert(userDO);
            if (inserted < 1) {
                throw new ServiceException(USER_RECORD_ADD_ERROR);
            }
            if (userInfo.getName() != null) usernameCachePenetrationBloomFilter.add(userInfo.getName());
            if (userInfo.getEmail() != null) userEmailCachePenetrationBloomFilter.add(userInfo.getEmail());
            return new UserLoginRespDTO(generateToken(userDO));
        } catch (DuplicateKeyException ex) {
            throw new ClientException(USER_RECORD_ADD_ERROR);
        }
    }

    private UserDO Verification4GetUser(String requestParam, String requestParam1) {
        // 校验邮箱格式
        if (RegexUtil.isEmailInvalid(requestParam)) {
            throw new ClientException(EMAIL_FORMAT_ERROR);
        }

        // 判断邮箱是否存在
        if (!hasEmail(requestParam)) {
            throw new ClientException(EMAIL_NOT_EXIST_ERROR);
        }

        // 校验验证码
        String code = stringRedisTemplate.opsForValue().get(EMAIL_CODE_KEY + requestParam);
        if (!Objects.equals(code, requestParam1)) {
            throw new ClientException(VERIFICATION_CODE_INVALID);
        }

        // 根据邮箱查询用户信息
        LambdaQueryWrapper<UserDO> queryWrapper = Wrappers.lambdaQuery(UserDO.class)
                .eq(UserDO::getEmail, requestParam);
        UserDO userDO = baseMapper.selectOne(queryWrapper);
        if (userDO == null) {
            throw new ClientException(USER_NOT_FOUND_ERROR);
        }
        return userDO;
    }

    /**
     * 生成登录令牌，并将用户信息保存到 redis中
     *
     * @param user 用户基础信息
     * @return 登录令牌
     */
    public String generateToken(UserDO user) {
        // 随机生成 token，作为登录令牌
        String token = UUID.randomUUID().toString(true);

        // 将 User 对象转为 HashMap 存储
        UserInfoDO userDTO = BeanUtil.copyProperties(user, UserInfoDO.class);
        Map<String, Object> userMap = BeanUtil.beanToMap(userDTO, new HashMap<>(), CopyOptions.create()
                .setIgnoreNullValue(true)
                .setFieldValueEditor((fieldName, fieldValue) -> fieldValue != null ? fieldValue.toString() : null));

        // 存储用户信息保存到 redis 中
        String tokenKey = USER_LOGIN_KEY + token;
        stringRedisTemplate.opsForHash().putAll(tokenKey, userMap);

        // 设置 token 有效期
        stringRedisTemplate.expire(tokenKey, USER_LOGIN_TOKEN_EXPIRE_TIME, TimeUnit.SECONDS);
        return token;
    }
}
