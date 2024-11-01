package com.nine.project.analyze.dto.req;

import lombok.Data;

/**
 * GitHub 用户所在国家/地区猜测请求 DTO
 */
@Data
public class GithubUserCountryReqDTO {
    /**
     * GitHub 用户 ID
     */
    private String githubUserId;

    /**
     * 猜测的国家
     */
    private String country;
}
