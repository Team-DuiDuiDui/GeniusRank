package com.nine.project.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

/**
 * SpringCloud Gateway CORS 拦截器
 */
@Component
public class CORSGatewayFilterFactory extends AbstractGatewayFilterFactory<CORSGatewayFilterFactory.Config> {

    public CORSGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            exchange.getResponse().getHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponse().getHeaders().add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
            exchange.getResponse().getHeaders().add("Access-Control-Allow-Headers", "Content-Type,Authorization");
            exchange.getResponse().getHeaders().add("Access-Control-Allow-Credentials", "true");
            if ("OPTIONS".equals(exchange.getRequest().getMethod().toString())) {
                exchange.getResponse().setStatusCode(HttpStatus.NO_CONTENT);
                return exchange.getResponse().setComplete();
            }
            return chain.filter(exchange);
        };
    }

    public static class Config {
    }

    @Override
    public List<String> shortcutFieldOrder() {
        // 如果不需要特定的配置，返回空列表
        return Collections.emptyList();
    }
}
