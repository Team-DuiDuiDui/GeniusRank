package com.nine.project.analyze.dto.req;

import lombok.Data;

import java.util.List;

@Data
public class GithubUserScoreReqDTO {

    private User user;
    private List<repo> repos;
    private List<pr> prs;
    private List<issue> issues;

    /**
     * Github 用户基础数据得分依据
     */
    @Data
    public static class User {
        private int followers;
        private int publicRepos;
        private int commit_amount;
        private int pr_amount;
        private int issue_amount;
    }

    /**
     * Github 用户仓库得分依据
     */
    @Data
    public static class repo {
        private boolean isForked;
        private int stars;
        private int forks;
        private int watches;
        private int openIssues;
    }

    /**
     * Github 用户 pr 得分依据
     */
    @Data
    public static class pr {
        private int prAndIssueAmount;
    }

    /**
     * Github 用户 issue 得分依据
     */
    @Data
    public static class issue {
        private int prAndIssueAmount;
    }
}
