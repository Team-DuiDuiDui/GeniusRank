package com.nine.project.analyze.dto.resp;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * GitHub 用户所在国家/地区猜测响应 DTO
 */
@Data
public class GithubUserCountryRespDTO {

    /**
     * GitHub 用户 ID
     */
    private String githubUserId;

    /**
     * 猜测的国家
     */
    private String country;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
}
