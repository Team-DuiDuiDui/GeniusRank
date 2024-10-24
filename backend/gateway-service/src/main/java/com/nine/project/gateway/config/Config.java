package com.nine.project.gateway.config;

import lombok.Data;

import java.util.List;

/**
 * 过滤器配置
 */
@Data
public class Config {

    /**
     * 白名单路径列表
     */
    private List<String> whitePathList;
}
