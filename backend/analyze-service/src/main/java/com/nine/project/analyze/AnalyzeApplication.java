package com.nine.project.analyze;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 分析数据服务启动类
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
public class AnalyzeApplication {

    public static void main(String[] args) {
        SpringApplication.run(AnalyzeApplication.class, args);
    }
}
