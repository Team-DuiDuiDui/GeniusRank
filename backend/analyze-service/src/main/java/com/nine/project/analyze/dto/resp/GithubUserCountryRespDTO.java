package com.nine.project.analyze.dto.resp;

import lombok.Data;


/**
 * GitHub 用户所在国家/地区猜测响应 DTO
 */
@Data
public class GithubUserCountryRespDTO {

    /**
     * GitHub 用户名
     */
    private String login;

    /**
     * ISO 3166-1 alpha-2 两位国家代码
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

    /**
     * 更新时间
     */
    private long updateTime;
}
