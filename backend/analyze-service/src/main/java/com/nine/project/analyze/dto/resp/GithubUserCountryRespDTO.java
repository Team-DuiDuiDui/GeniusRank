package com.nine.project.analyze.dto.resp;

import lombok.Data;

@Data
public class GithubUserCountryRespDTO {
    /**
     * id
     */
    private Long id;

    /**
     * GitHub 用户 ID
     */
    private String githubUserId;

    /**
     * 猜测的国家
     */
    private String country;
}
