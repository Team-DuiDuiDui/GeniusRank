package com.nine.project.analyze.dto.req;

import lombok.Data;

import java.util.List;

/**
 * 创建用户详细分数请求 DTO
 */
@Data
public class GithubDetailedScoreReqDTO {
    /**
     * GitHub 用户登录名
     */
    private String login;
    /**
     * 昵称
     */
    private String name;
    /**
     * 头像
     */
    private String avatarUrl;
    /**
     * 关注者信息对象
     */
    private Followers followers;
    /**
     * 生命周期内收到的赞助总值计数
     */
    private LifetimeReceivedSponsorshipValues lifetimeReceivedSponsorshipValues;
    /**
     * 拉取请求信息对象
     */
    private PullRequests pullRequests;
    /**
     * 问题信息对象
     */
    private Issues issues;
    /**
     * 仓库信息对象
     */
    private Repositories repositories;
    /**
     * 贡献过的仓库信息对象
     */
    private RepositoriesContributedTo repositoriesContributedTo;

    @Data
    public static class Followers {
        /**
         * 关注者总数
         */
        private int totalCount;
    }

    @Data
    public static class LifetimeReceivedSponsorshipValues {
        /**
         * 生命周期内收到的赞助总值计数
         */
        private int totalCount;
    }

    @Data
    public static class PullRequests {
        /**
         * 拉取请求列表，可能为空列表、空数组或 null
         */
        private List<PullRequest> nodes;
        /**
         * 拉取请求总数
         */
        private int totalCount;
    }

    @Data
    public static class PullRequest {
        /**
         * 拉取请求的状态，可能是'CLOSED'、'MERGED'或'OPEN'
         */
        private String state;
        /**
         * 提交信息对象
         */
        private Commits commits;
        /**
         * 基础仓库对象，可能为 null
         */
        private Repository baseRepository;
    }

    @Data
    public static class Commits {
        /**
         * 提交总数
         */
        private int totalCount;
    }

    @Data
    public static class Issues {
        /**
         * 问题列表，可能为空列表、空数组或 null
         */
        private List<Issue> nodes;
        /**
         * 问题总数
         */
        private int totalCount;
    }

    @Data
    public static class Issue {
        /**
         * 对应的仓库对象
         */
        private Repository repository;
    }

    @Data
    public static class Repositories {
        /**
         * 仓库列表，可能为空列表、空数组或 null
         */
        private List<Repository> nodes;
        /**
         * 仓库总数
         */
        private int totalCount;
    }

    @Data
    public static class RepositoriesContributedTo {
        /**
         * 贡献过的仓库列表，可能为空列表、空数组或 null
         */
        private List<Repository> nodes;
        /**
         * 贡献过的仓库总数
         */
        private int totalCount;
    }

    @Data
    public static class Repository {
        /**
         * 星标数量
         */
        private int stargazerCount;
        /**
         * fork 数量
         */
        private int forkCount;
        /**
         * 拉取请求总数，可能为 null
         */
        private PullRequests pullRequests;
        /**
         * 问题总数，可能为 null
         */
        private Issues issues;
        /**
         * 主要编程语言对象，可能为 null
         */
        private PrimaryLanguage primaryLanguage;
        /**
         * 关注者信息对象
         */
        private Watchers watchers;
    }

    @Data
    public static class PrimaryLanguage {
        /**
         * 主要编程语言名称
         */
        private String name;
    }

    @Data
    public static class Watchers {
        /**
         * 关注者总数
         */
        private int totalCount;
    }
}