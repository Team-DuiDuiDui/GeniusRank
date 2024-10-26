package com.nine.project.user.controller;

import cn.hutool.core.bean.BeanUtil;
import com.nine.project.framework.result.Result;
import com.nine.project.framework.web.Results;
import com.nine.project.user.dto.req.UserUpdateReqDTO;
import com.nine.project.user.dto.resp.UserDesensitizedRespDTO;
import com.nine.project.user.dto.resp.UserRespDTO;
import com.nine.project.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 用户管理控制层
 */
@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 获取用户无脱敏信息
     */
    @GetMapping("/api/user")
    public Result<UserRespDTO> getUserInfo() {
        return Results.success(userService.getUserInfo());
    }

    /**
     * 获取用户脱敏信息
     */
    @GetMapping("/api/user/desensitized")
    public Result<UserDesensitizedRespDTO> getDesensitizedUserInfo() {
        return Results.success(BeanUtil.toBean(userService.getUserInfo(), UserDesensitizedRespDTO.class));
    }

    /**
     * 更新用户信息
     */
    @PutMapping("/api/user")
    public Result<Void> update(@RequestBody UserUpdateReqDTO requestParam) {
        userService.update(requestParam);
        return Results.success();
    }

    /**
     * 检查用户是否登录
     */
    @GetMapping("/api/user/check-login")
    public Result<Boolean> checkLogin() {
        return Results.success(userService.checkLogin());
    }

    /**
     * 用户登出
     */
    @DeleteMapping("/api/user/logout")
    public Result<Void> logout() {
        userService.logout();
        return Results.success();
    }
}
