
package com.nine.project.aggregation;


import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * 聚合服务应用启动器
 */
@SpringBootApplication(scanBasePackages = {
        "com.nine.project.user"
})
@MapperScan(value = {
        "com.nine.project.user.dao.mapper"
})
@EnableDiscoveryClient
public class AggregationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AggregationServiceApplication.class, args);
    }
}
