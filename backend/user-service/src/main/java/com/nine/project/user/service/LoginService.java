package com.nine.project.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.nine.project.user.dao.entity.UserDO;
import com.nine.project.user.dto.req.*;
import com.nine.project.user.dto.resp.UserLoginRespDTO;
import com.nine.project.user.dto.resp.UserRegisterRespDTO;

/**
 * 用户登录服务接口层
 */
public interface LoginService extends IService<UserDO> {

    /**
     * 发送验证码到邮箱
     * @param email 邮箱
     */
    void sendCode2Email(String email);

    /**
     * 判断邮箱是否存在
     *
     * @param email 邮箱
     * @return 邮箱存在返回 true:存在，false:不存在
     */
    Boolean hasEmail(String email);

    /**
     * 判断用户名是否存在
     *
     * @param username 用户名
     * @return 用户名存在返回 true:存在，false:不存在
     */
    Boolean hasUsername(String username);

    /**
     * 注册用户
     * @param requestParam 注册用户请求参数
     * @return 用户注册返回参数 Token
     */
    UserRegisterRespDTO register(UserRegisterReqDTO requestParam);

    /**
     * 用户登录
     * @param requestParam 用户登录请求参数
     * @return 用户登录返回参数 Token
     */
    UserLoginRespDTO loginByCode(UserLoginByCodeReqDTO requestParam);

    /**
     * 用户登录
     * @param requestParam 用户登录请求参数
     * @return 用户登录返回参数 Token
     */
    UserLoginRespDTO login(UserLoginReqDTO requestParam);

    /**
     * 忘记密码
     *
     * @param requestParam 忘记密码请求参数
     * @return 忘记密码返回参数 Token
     *
     * */
    UserLoginRespDTO forgetPassword(UserForgetPwdReqDTO requestParam);

    /**
     * 实现 OAuth 用户登录/注册
     * @param requestParam 用户登录请求参数
     * @return 用户登录返回参数 Token
     */
    UserLoginRespDTO loginByOAuth(UserLoginByOAuthDTO requestParam);
}
