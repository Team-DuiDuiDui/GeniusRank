package com.nine.project.user.controller;

import com.nine.project.framework.result.Result;
import com.nine.project.framework.web.Results;
import com.nine.project.user.dto.req.*;
import com.nine.project.user.dto.resp.UserLoginRespDTO;
import com.nine.project.user.dto.resp.UserRegisterRespDTO;
import com.nine.project.user.service.LoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 用户登录控制层
 */
@RestController
@RequiredArgsConstructor
public class LoginController {

    private final LoginService loginService;

    /**
     * 发送验证码到电子邮箱中
     */
    @GetMapping("/api/user/code")
    public Result<Void> sendCode2Mail(@RequestParam("email") String email) {
        loginService.sendCode2Email(email);
        return Results.success();
    }

    /**
     * 判断邮箱是否存在
     */
    @GetMapping("/api/user/has-email")
    public Result<Boolean> hasEmail(@RequestParam("email") String email) {
        return Results.success(loginService.hasEmail(email));
    }

    /**
     * 判断用户名是否存在
     */
    @GetMapping("/api/user/has-username")
    public Result<Boolean> hasUsername(@RequestParam("username") String username) {
        return Results.success(loginService.hasUsername(username));
    }

    /**
     * 注册用户
     */
    @PostMapping("/api/user/register")
    public Result<UserRegisterRespDTO> register(@RequestBody UserRegisterReqDTO requestParam) {
        return Results.success(loginService.register(requestParam));
    }

    /**
     * 用户根据邮箱验证码登录
     */
    @PostMapping("/api/user/loginByCode")
    public Result<UserLoginRespDTO> loginByCode(@RequestBody UserLoginByCodeReqDTO requestParam) {
        return Results.success(loginService.loginByCode(requestParam));
    }

    /**
     * 用户登录
     */
    @PostMapping("/api/user/login")
    public Result<UserLoginRespDTO> login(@RequestBody UserLoginReqDTO requestParam) {
        return Results.success(loginService.login(requestParam));
    }

    /**
     * 用户 OAuth 登录/注册
     */
    @PostMapping("/api/user/loginByOAuth")
    public Result<UserLoginRespDTO> loginByOAuth(@RequestBody UserLoginByOAuthDTO requestParam) {
        return Results.success(loginService.loginByOAuth(requestParam));
    }


    /**
     * 忘记密码
     */
    @PostMapping("/api/user/forget-password")
    public Result<UserLoginRespDTO> forgetPassword(@RequestBody UserForgetPwdReqDTO requestParam) {
        return Results.success(loginService.forgetPassword(requestParam));
    }
}
