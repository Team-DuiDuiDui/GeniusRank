package com.nine.project.user.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.nine.project.user.dao.entity.UserDO;
import com.nine.project.user.dto.req.UserUpdateReqDTO;
import com.nine.project.user.dto.resp.UserRespDTO;

/**
 * 用户接口层
 */
public interface UserService extends IService<UserDO> {

    /**
     * 获取用户信息
     *
     * @return 用户返回实体
     */
    UserRespDTO getUserInfo();

    /**
     * 更新用户信息
     *
     * @param requestParam 更新用户信息请求参数
     */
    void update(UserUpdateReqDTO requestParam);

    /**
     * 校验用户是否登录
     * @return 用户是否登录
     */
    Boolean checkLogin();

    /**
     * 用户退出登录
     */
    void logout();
}
