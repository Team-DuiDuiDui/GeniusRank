package com.nine.project.analyze.toolkit;

import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * Github 用户得分计算工具类
 */
public class GithubUserScoreCalculator {

    /**
     * 普通计算计算用户总得分并保留两位小数，无需登录
     * @param githubUserScoreReqDTO Github 用户全部数据
     * @return 总得分
     */
    public static GithubUserScoreRespDTO calculate(GithubUserScoreReqDTO githubUserScoreReqDTO) {
        // 计算用户得分并保留两位小数
        double userScore = calculateUserScore(githubUserScoreReqDTO.getUser());
        BigDecimal userScoreDecimal = BigDecimal.valueOf(userScore).setScale(2, RoundingMode.HALF_UP);

        // 计算仓库得分并保留两位小数
        double repoScore = calculateRepoScore(new ArrayList<>(githubUserScoreReqDTO.getRepos().subList(0, 3)));
        BigDecimal repoScoreDecimal = BigDecimal.valueOf(repoScore).setScale(2, RoundingMode.HALF_UP);

        // 计算拉取请求得分并保留两位小数
        double prScore = calculatePrScore(githubUserScoreReqDTO.getPrs());
        BigDecimal prScoreDecimal = BigDecimal.valueOf(prScore).setScale(2, RoundingMode.HALF_UP);

        // 计算问题得分并保留两位小数
        double issueScore = calculateIssueScore(githubUserScoreReqDTO.getIssues());
        BigDecimal issueScoreDecimal = BigDecimal.valueOf(issueScore).setScale(2, RoundingMode.HALF_UP);

        // 计算总得分并保留两位小数并返回响应体
        BigDecimal totalScoreDecimal = userScoreDecimal.add(repoScoreDecimal).add(prScoreDecimal).add(issueScoreDecimal);

        return GithubUserScoreRespDTO.builder()
                .userScore(userScoreDecimal.doubleValue())
                .reposScore(repoScoreDecimal.doubleValue())
                .prsScore(prScoreDecimal.doubleValue())
                .issuesScore(issueScoreDecimal.doubleValue())
                .totalScore(totalScoreDecimal.doubleValue())
                .build();
    }

    /**
     * 计算 Github 用户得分的通用指数衰减函数
     * @param maxScore 最大得分
     * @param criticalPoint 临界点，保证前 90% 的变化曲线增长速度明显，后 10% 的变化曲线增长慢
     * @param point 当前点
     * @return 计算结果
     */
    private static double calculateFunction(double maxScore, double criticalPoint, double point) {
        return maxScore * (1 - Math.exp(-2.5 * point / criticalPoint));
    }

    /**
     * 计算 Github 用户基础数据得分
     * @param user Github 用户基础数据
     * @return 用户基础数据得分
     */
    private static double calculateUserScore(GithubUserScoreReqDTO.User user) {
        // followers 的得分计算
        double followersScore = calculateFunction(8, 1000, user.getFollowers());

        // publicRepos 的得分计算
        double publicReposScore = calculateFunction(2, 10, user.getPublic_repos());

        // commit_amount 的得分计算
        double commitAmountScore = calculateFunction(5, 1000, user.getCommit_amount());

        // pr_amount 的得分计算
        double prAmountScore = calculateFunction(10, 100, user.getPr_amount());

        // issue_amount 的得分计算
        double issueAmountScore = calculateFunction(5, 100, user.getIssue_amount());

        return followersScore + publicReposScore + commitAmountScore + prAmountScore + issueAmountScore;
    }

    /**
     * 计算 Github 用户仓库数据得分
     * @param repos Github 用户仓库数据
     * @return 用户仓库数据得分
     */
    private static double calculateRepoScore(List<GithubUserScoreReqDTO.repo> repos) {
        if (repos == null || repos.isEmpty()) {
            return 0;
        }

        double totalScore = 0;
        double MaxisForkedScore = 5.0 / repos.toArray().length;
        double MaxStarsScore = 20.0 / repos.toArray().length;
        double MaxForksScoreScore = 15.0 / repos.toArray().length;
        double MaxWatchesScore = 5.0 / repos.toArray().length;
        double MaxOpenIssuesScore = 5.0 / repos.toArray().length;
        for (GithubUserScoreReqDTO.repo repo : repos) {
            // isForked 的得分计算
            double isForkedScore = repo.isForked()? MaxisForkedScore : 0;

            // stars 的得分计算
            double starsScore = calculateFunction(MaxStarsScore, 5000, repo.getStars());

            // forks 的得分计算
            double forksScore = calculateFunction(MaxForksScoreScore, 1000, repo.getForks());

            // watches 的得分计算
            double watchesScore = calculateFunction(MaxWatchesScore, 500, repo.getWatchers());

            // openIssues 的得分计算
            double openIssuesScore = calculateFunction(MaxOpenIssuesScore, 500, repo.getOpen_issues());

            totalScore += isForkedScore + starsScore + forksScore + watchesScore + openIssuesScore;
        }
        return totalScore;
    }

    /**
     * 计算 Github 用户 prs 数据得分
     * @param prs Github 用户 prs 数据
     * @return 用户 prs 数据得分
     */
    private static double calculatePrScore(List<GithubUserScoreReqDTO.pr> prs) {
        if (prs == null || prs.isEmpty()) {
            return 0;
        }

        double totalScore = 0;
        double MaxPrAndIssueAmountMaxScore = 15.0 / prs.toArray().length;
        for (GithubUserScoreReqDTO.pr pr : prs) {
            totalScore += calculateFunction(MaxPrAndIssueAmountMaxScore, 500, pr.getPr_and_issue_amount());
        }
        return totalScore;
    }

    /**
     * 计算 Github 用户 issues 数据得分
     * @param issues Github 用户 issues 数据
     * @return 用户 issues 数据得分
     */
    private static double calculateIssueScore(List<GithubUserScoreReqDTO.issue> issues) {
        if (issues == null || issues.isEmpty()) {
            return 0;
        }

        double totalScore = 0;
        double MaxPrAndIssueAmountMaxScore = 5.0 / issues.toArray().length;
        for (GithubUserScoreReqDTO.issue issue : issues) {
            totalScore += calculateFunction(MaxPrAndIssueAmountMaxScore, 500, issue.getPr_and_issue_amount());
        }
        return totalScore;
    }
}
