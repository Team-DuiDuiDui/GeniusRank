package com.nine.project.gateway.constant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 网关错误返回信息
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GatewayErrorResult {

    /**
     * HTTP 状态码
     */
    private String code;

    /**
     * 返回信息
     */
    private String message;

    /**
     * 是否返回正确
     */
    private boolean success = false;
}