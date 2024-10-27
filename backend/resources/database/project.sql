# 创建数据库
CREATE DATABASE IF NOT EXISTS project_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_general_ci;

# 使用数据库
USE project_db;

# 1. 创建用户表 (Users)
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

# 2. 创建 GitHub 用户表 (GithubUsers)
CREATE TABLE t_github_user (
  id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID' PRIMARY KEY,
  username VARCHAR(256) NULL COMMENT 'GitHub 用户名',
  avatar_url VARCHAR(255) NULL COMMENT 'GitHub 用户头像',
  description VARCHAR(255) NULL COMMENT 'GitHub 用户描述',

  create_time DATETIME NULL COMMENT '创建时间',
  update_time DATETIME NULL COMMENT '修改时间',
  del_flag TINYINT(1) NULL COMMENT '删除标识 0：未删除 1：已删除',

  CONSTRAINT idx_username UNIQUE (username)
) COMMENT 'GitHub 用户表';

# 3. 创建 GitHub 用户分数表 (GithubUserScores)
CREATE TABLE t_github_user_score (
   id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID' PRIMARY KEY,
   github_user_id BIGINT NOT NULL COMMENT 'GitHub 用户 ID',
   followers      INT NOT NULL COMMENT '跟随者数量',
   stars          INT DEFAULT 0 COMMENT 'Star 数量',
   pull_requests  INT DEFAULT 0 COMMENT 'Pull Request 数量',
   issues         INT DEFAULT 0 COMMENT 'Issue 数量',
   score          DOUBLE NOT NULL COMMENT '算法所得分数',

   create_time    DATETIME NULL COMMENT '创建时间',
   update_time    DATETIME NULL COMMENT '修改时间',
   del_flag       TINYINT(1) NULL COMMENT '删除标识 0：未删除 1：已删除',

   CONSTRAINT idx_github_user_id UNIQUE (github_user_id)
) COMMENT 'GitHub 用户分数表';


# 4. 创建 Github 用户所在国家/地区猜测表 (GithubUserCountryGuess)
CREATE TABLE t_github_user_country_guess (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID' PRIMARY KEY,
  github_user_id BIGINT NOT NULL COMMENT 'GitHub 用户 ID',
  country        VARCHAR(50) COMMENT '国家/地区',

  create_time    DATETIME NULL COMMENT '创建时间',
  update_time    DATETIME NULL COMMENT '修改时间',
  del_flag       TINYINT(1) NULL COMMENT '删除标识 0：未删除 1：已删除',

  CONSTRAINT idx_github_user_id UNIQUE (github_user_id)
) COMMENT 'GitHub 用户所在国家/地区猜测表';


# 5. 创建 Github 用户开发者领域猜测表 (GithubUserDeveloperTypeGuess)
CREATE TABLE t_github_user_developer_type_guess (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID' PRIMARY KEY,
    github_user_id BIGINT NOT NULL COMMENT 'GitHub 用户 ID',
    developer_type VARCHAR(255) COMMENT '开发者领域',

    create_time    DATETIME NULL COMMENT '创建时间',
    update_time    DATETIME NULL COMMENT '修改时间',
    del_flag       TINYINT(1) NULL COMMENT '删除标识 0：未删除 1：已删除',

    CONSTRAINT idx_github_user_id UNIQUE (github_user_id)
) COMMENT 'GitHub 用户开发者领域猜测表';


# 6. 创建 Github 用户技术能力评估信息整理表(GithubUserTechCapAssessment)
CREATE TABLE t_github_user_tech_cap_assessment (
   id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID' PRIMARY KEY,
   github_user_id BIGINT NOT NULL COMMENT 'GitHub 用户 ID',

   # 开发者技术能力评估信息自动整理，有的开发者在 GitHub 上有博客链接，甚至有一些用 GitHub 搭建的网站，也有一些在 GitHub 本身有账号相关介绍，基于类 ChatGLM 应用整理出的开发者评估信息。
   technical_capability     VARCHAR(1000) COMMENT 'AI 所提供的技术能力评估信息',

   create_time    DATETIME NULL COMMENT '创建时间',
   update_time    DATETIME NULL COMMENT '修改时间',
   del_flag       TINYINT(1) NULL COMMENT '删除标识 0：未删除 1：已删除',

   CONSTRAINT idx_github_user_id UNIQUE (github_user_id)
) COMMENT 'Github 用户技术能力评估信息整理表';

# 7. 创建 AI Prompt 表(Prompt)
CREATE TABLE t_prompt (
   id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID' PRIMARY KEY,
   prompt_type    INT NOT NULL COMMENT 'Prompt 类型 1: 流式prompt 2: 同步prompt',
   prompt_text    VARCHAR(1000) COMMENT 'Prompt 描述',

   create_time    DATETIME NULL COMMENT '创建时间',
   update_time    DATETIME NULL COMMENT '修改时间',
   del_flag       TINYINT(1) NULL COMMENT '删除标识 0：未删除 1：已删除'
) COMMENT 'AI Prompt 表';