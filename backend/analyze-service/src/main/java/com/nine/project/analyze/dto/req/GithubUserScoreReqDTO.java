package com.nine.project.analyze.dto.req;

import lombok.Data;

import java.util.List;

/**
 * 创建用户分数请求 DTO
 */
@Data
public class GithubUserScoreReqDTO {

    private User user; // 用户信息
    private List<repo> repos; // 用户的仓库列表
    private List<pr> prs; // 用户的拉取请求列表
    private List<issue> issues; // 用户的问题列表

    /**
     * Github 用户基础数据得分依据
     */
    @Data
    public static class User {
        private String login; // Github 用户名
        private int followers; // 跟随者数量
        private int public_repos; // 公开仓库数量
        private int commit_amount; // 提交数量
        private int pr_amount; // 拉取请求数量
        private int issue_amount; // 问题数量
    }

    /**
     * Github 用户仓库得分依据
     */
    @Data
    public static class repo {
        private boolean forked; // 是否为 fork 仓库
        private int stars; // 星标数量
        private int forks; // fork 数量
        private int watchers; // 关注数量
        private int open_issues; // 未关闭的问题数量
    }

    /**
     * Github 用户 pr 得分依据
     */
    @Data
    public static class pr {
        private int pr_and_issue_amount; // 拉取请求和问题的总数量
    }

    /**
     * Github 用户 issue 得分依据
     */
    @Data
    public static class issue {
        private int pr_and_issue_amount; // 拉取请求和问题的总数量
    }
}
