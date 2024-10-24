package com.nine.project.user.config;

import com.nine.project.user.dao.entity.AliOssDO;
import com.nine.project.user.toolkit.OssUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 阿里云oss配置
 */
@Slf4j
@Configuration
public class OssConfiguration {

    @Bean
    @ConditionalOnMissingBean
    public OssUtil aliOssUtil(AliOssDO aliOssProperties) {
        log.info("开始创建阿里云 oss 对象: {}", aliOssProperties);
        return new OssUtil(aliOssProperties.getEnable(),
                aliOssProperties.getEndpoint(),
                aliOssProperties.getAccessKeyId(),
                aliOssProperties.getAccessKeySecret(),
                aliOssProperties.getBucketName(),
                aliOssProperties.getDomain()
        );
    }
}
