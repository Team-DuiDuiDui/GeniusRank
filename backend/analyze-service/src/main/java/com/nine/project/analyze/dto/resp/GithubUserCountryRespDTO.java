package com.nine.project.analyze.dto.resp;

import lombok.Data;

import java.time.LocalDateTime;

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
