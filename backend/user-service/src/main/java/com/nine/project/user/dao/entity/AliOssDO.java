package com.nine.project.user.dao.entity;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 阿里云 OSS 配置信息实体
 */
@Data
@Component
@ConfigurationProperties(prefix = "project.alioss")
public class AliOssDO {

    /**
     * 是否启用阿里云 OSS 服务
     */
    private Boolean enable;

    /**
     * 阿里云 OSS（对象存储服务）的访问域名
     */
    private String endpoint;

    /**
     * 阿里云 OSS（对象存储服务）的访问密钥
     */
    private String accessKeyId;

    /**
     * 用于访问 OSS 的配对密钥
     */
    private String accessKeySecret;

    /**
     * 阿里云 OSS（对象存储服务）的存储空间名称
     */
    private String bucketName;

    /**
     * 本地存储空间域名，如不采用 alioss，则该存储空间为兜底
     */
    private String domain;
}
