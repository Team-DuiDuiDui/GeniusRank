package com.nine.project.analyze.dao.entity;


import com.baomidou.mybatisplus.annotation.TableName;
import com.nine.project.framework.database.base.BaseDO;
import lombok.Data;

/**
 * GitHub 用户所在国家/地区猜测表
 */
@Data
@TableName("t_github_user_country_guess")
public class GithubUserCountryGuessDO extends BaseDO {
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
