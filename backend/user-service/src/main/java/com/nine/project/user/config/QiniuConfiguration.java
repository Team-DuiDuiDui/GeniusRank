package com.nine.project.user.config;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 七牛云OSS相关配置
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "project.qiniu")
public class QiniuConfiguration {
    /**
     * AC
     */
    private String accessKey;
    /**
     * SC
     */
    private String secretKey;
    /**
     * 存储空间
     */
    private String bucket;
    /**
     * 上传目录
     */
    private String directory;
    /**
     * 访问域名
     */
    private String domain;
}
