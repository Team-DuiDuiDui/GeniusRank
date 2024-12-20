package com.nine.project.analyze.dto.req;

import lombok.Data;

/**
 * GitHub 用户所在国家/地区猜测请求 DTO
 */
@Data
public class GithubUserCountryReqDTO {
    /**
     * GitHub 用户名
     */
    private String login;

    /**
     * GitHub ISO 简写 ISO 简写
     */
    private String country_iso;

    /**
     * 猜测信息
     */
    private String message;

    /**
     * 可信度
     */
    private Double confidence;
}
