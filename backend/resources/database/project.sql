# 创建数据库
CREATE DATABASE IF NOT EXISTS project_db
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_general_ci;

# 使用数据库
USE project_db;

# 1. 创建用户表 (Users)
CREATE TABLE t_user (
    id BIGINT COMMENT 'ID' PRIMARY KEY,
    username VARCHAR(256) NULL COMMENT '用户名',
    avatar VARCHAR(256) NULL COMMENT '用户头像',
    email VARCHAR(512) NULL COMMENT '邮箱',
    password VARCHAR(512) NULL COMMENT '密码',
    create_time DATETIME NULL COMMENT '创建时间',
    update_time DATETIME NULL COMMENT '修改时间',
    del_flag TINYINT(1) NULL COMMENT '删除标识 0：未删除 1：已删除'
) COMMENT '用户表';

# 2. 创建 GitHub 用户分数表 (GithubUserScores)
CREATE TABLE t_github_user_score (
   id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID' PRIMARY KEY,
   login VARCHAR(256) NOT NULL COMMENT 'GitHub 用户名',
   total_score    DOUBLE NOT NULL COMMENT '算法所得分数',
   user_score     DOUBLE NULL COMMENT 'Github 用户基础数据得分',
   repos_score    DOUBLE NULL COMMENT 'Github 用户仓库数据得分',
   prs_score      DOUBLE NULL COMMENT 'Github 用户 prs 数据得分',
   issues_score   DOUBLE NULL COMMENT 'Github 用户 issues 数据得分',

   create_time    DATETIME NULL COMMENT '创建时间',
   update_time    DATETIME NULL COMMENT '修改时间',
   del_flag       TINYINT(1) NULL COMMENT '删除标识 0：未删除 1：已删除',

   CONSTRAINT idx_login UNIQUE (login)
) COMMENT 'GitHub 用户分数表';


# 3. 创建 Github 用户所在国家/地区猜测表 (GithubUserCountryGuess)
CREATE TABLE t_github_user_country_guess (
  id                    BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID' PRIMARY KEY,
  login                 VARCHAR(256) NOT NULL COMMENT 'GitHub 用户名',
  country_iso           VARCHAR(50) COMMENT '国家/地区 ISO 缩写',
  country_name          VARCHAR(50) COMMENT '国家/地区',

  create_time    DATETIME NULL COMMENT '创建时间',
  update_time    DATETIME NULL COMMENT '修改时间',
  del_flag       TINYINT(1) NULL COMMENT '删除标识 0：未删除 1：已删除',

  CONSTRAINT idx_login UNIQUE (login)
) COMMENT 'GitHub 用户所在国家/地区猜测表';


# 4. 创建 Github 用户开发者领域表 (GithubUserDeveloperType)
CREATE TABLE t_github_user_developer_type (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID' PRIMARY KEY,
    login VARCHAR(256) NOT NULL COMMENT 'GitHub 用户名',
    developer_type VARCHAR(255) COMMENT '开发者领域',

    CONSTRAINT idx_developer_type UNIQUE (developer_type)
) COMMENT 'GitHub 用户开发者领域表';


# 5. 创建 Github 用户技术能力评估信息整理表(GithubUserTechCapAssessment)
CREATE TABLE t_github_user_tech_cap_assessment (
   id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID' PRIMARY KEY,
   login VARCHAR(256) NOT NULL COMMENT 'GitHub 用户名',

   # 开发者技术能力评估信息自动整理，有的开发者在 GitHub 上有博客链接，甚至有一些用 GitHub 搭建的网站，也有一些在 GitHub 本身有账号相关介绍，基于类 ChatGLM 应用整理出的开发者评估信息。
   technical_capability     VARCHAR(1000) COMMENT 'AI 所提供的技术能力评估信息',

   create_time    DATETIME NULL COMMENT '创建时间',
   update_time    DATETIME NULL COMMENT '修改时间',
   del_flag       TINYINT(1) NULL COMMENT '删除标识 0：未删除 1：已删除',

   CONSTRAINT idx_login UNIQUE (login)
) COMMENT 'Github 用户技术能力评估信息整理表';

# 6. 创建 AI Prompt 表(Prompt)
CREATE TABLE t_prompt (
   id             BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'ID' PRIMARY KEY,
   prompt_type    INT NOT NULL COMMENT 'Prompt 类型 1: 流式prompt 2: 同步prompt',
   prompt_text    VARCHAR(1000) COMMENT 'Prompt 描述',

   create_time    DATETIME NULL COMMENT '创建时间',
   update_time    DATETIME NULL COMMENT '修改时间',
   del_flag       TINYINT(1) NULL COMMENT '删除标识 0：未删除 1：已删除'
) COMMENT 'AI Prompt 表';
