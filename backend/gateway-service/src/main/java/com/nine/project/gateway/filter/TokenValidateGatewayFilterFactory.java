package com.nine.project.gateway.filter;


import com.alibaba.fastjson2.JSON;
import com.nine.project.gateway.config.Config;
import com.nine.project.gateway.constant.GatewayErrorResult;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBufferFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import static com.nine.project.gateway.constant.GatewayErrorCode.TOKEN_EXPIRED_ERROR;
import static com.nine.project.gateway.constant.GatewayErrorCode.TOKEN_NULL_ERROR;
import static com.nine.project.gateway.constant.RedisCacheConstant.USER_LOGIN_KEY;
import static com.nine.project.gateway.constant.RedisCacheConstant.USER_LOGIN_TOKEN_EXPIRE_TIME;

/**
 * SpringCloud Gateway Token 拦截器
 */
@Component
public class TokenValidateGatewayFilterFactory extends AbstractGatewayFilterFactory<Config> {

    private final StringRedisTemplate stringRedisTemplate;

    public TokenValidateGatewayFilterFactory(StringRedisTemplate stringRedisTemplate) {
        super(Config.class);
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            // 获取请求对象的路径和方法
            ServerHttpRequest request = exchange.getRequest();
            String requestPath = request.getPath().toString();

            // 如果请求路径不在白名单中，即需要 token 登录凭证
            if (!isPathInWhiteList(requestPath,  config.getWhitePathList())) {
                String token = request.getHeaders().getFirst("Authorization");
                Map<Object, Object> userMap = stringRedisTemplate.opsForHash().entries(USER_LOGIN_KEY + token);

                // 如果token不为空，并且 redis 中存在该用户信息，则将 userId 存放至请求头，并刷新 token 过期时间
                if (StringUtils.hasText(token) && !userMap.isEmpty()) {
                    // 修改请求头中的用户ID
                    ServerHttpRequest.Builder builder = exchange.getRequest().mutate().headers(httpHeaders -> httpHeaders.set("userId", Objects.requireNonNull(userMap.get("id")).toString()));

                    // 刷新 redis 中 token 的过期时间
                    stringRedisTemplate.expire( USER_LOGIN_KEY + token, USER_LOGIN_TOKEN_EXPIRE_TIME, TimeUnit.SECONDS);

                    // 继续执行过滤器链
                    return chain.filter(exchange.mutate().request(builder.build()).build());
                }

                // 否则如果 token 为空或者 token 过期即缓存中不存在该用户信息，则返回未授权响应
                ServerHttpResponse response = exchange.getResponse();
                response.setStatusCode(HttpStatus.UNAUTHORIZED);

                // 如果 token 为空
                if (!StringUtils.hasLength(token)) {
                    return response.writeWith(Mono.fromSupplier(() -> {
                        DataBufferFactory bufferFactory = response.bufferFactory();
                        GatewayErrorResult resultMessage = GatewayErrorResult.builder()
                                .code(TOKEN_NULL_ERROR.code())
                                .message(TOKEN_NULL_ERROR.message())
                                .build();
                        return bufferFactory.wrap(JSON.toJSONString(resultMessage).getBytes());
                    }));
                }

                // token 过期即缓存中不存在该用户信息
                return response.writeWith(Mono.fromSupplier(() -> {
                    DataBufferFactory bufferFactory = response.bufferFactory();
                    GatewayErrorResult resultMessage = GatewayErrorResult.builder()
                            .code(TOKEN_EXPIRED_ERROR.code())
                            .message(TOKEN_EXPIRED_ERROR.message())
                            .build();
                    return bufferFactory.wrap(JSON.toJSONString(resultMessage).getBytes());
                }));
            }

            // 否则如果在白名单中即不需要 token 登录凭证，则继续执行过滤器链
            return chain.filter(exchange);
        };
    }

    /**
     * 判断请求路径是否在白名单中
     *
     * @param requestPath   请求路径
     * @param whitePathList 白名单列表
     * @return 如果白名单列表不为空，且请求路径以白名单列表中的任意一个路径开头，返回true，否则返回false
     */
    private boolean isPathInWhiteList(String requestPath, List<String> whitePathList) {
        if (CollectionUtils.isEmpty(whitePathList)) {
            return false;
        }

        // 使用正则表达式进行匹配
        for (String whitePath : whitePathList) {
            // 将白名单路径转换为正则表达式
            String regex = whitePath.replace("**", ".*").replace("/*", "/.*");
            if (requestPath.matches(regex)) {
                return true;
            }
        }

        return false;
    }
}