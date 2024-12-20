package com.nine.project.user.dao.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import com.nine.project.framework.database.base.BaseDO;
import lombok.Builder;
import lombok.Data;

/**
 * 用户持久层实体
 */
@Data
@Builder
@TableName("t_user")
public class UserDO extends BaseDO {
    /**
     * id
     */
    private Long id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    private String password;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 头像地址
     */
    private String avatar;
}
