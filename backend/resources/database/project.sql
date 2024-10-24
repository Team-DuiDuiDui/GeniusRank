-- 创建数据库
CREATE DATABASE IF NOT EXISTS project_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_general_ci;

-- 使用数据库
USE user_db;

-- 创建用户表
CREATE TABLE t_user (
                        id BIGINT AUTO_INCREMENT COMMENT 'ID' PRIMARY KEY,
                        username VARCHAR(256) NULL COMMENT '用户名',
                        password VARCHAR(512) NULL COMMENT '密码',
                        email VARCHAR(512) NULL COMMENT '邮箱',
                        avatar VARCHAR(256) NULL COMMENT '用户头像',
                        create_time DATETIME NULL COMMENT '创建时间',
                        update_time DATETIME NULL COMMENT '修改时间',
                        del_flag TINYINT(1) NULL COMMENT '删除标识 0：未删除 1：已删除',
                        CONSTRAINT idx_email UNIQUE (email),
                        CONSTRAINT idx_username UNIQUE (username)
) COMMENT '用户表';