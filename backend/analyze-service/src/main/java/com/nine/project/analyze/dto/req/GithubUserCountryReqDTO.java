package com.nine.project.analyze.dto.req;

import lombok.Data;

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
