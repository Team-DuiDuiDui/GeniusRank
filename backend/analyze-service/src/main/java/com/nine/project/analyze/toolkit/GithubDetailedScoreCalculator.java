package com.nine.project.analyze.toolkit;

import com.nine.project.analyze.dto.req.GithubDetailedScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Github 用户详细得分计算工具类
 */
public class GithubDetailedScoreCalculator {

    /**
     * 普通计算计算用户总得分并保留两位小数，无需登录
     * @param githubUserScoreReqDTO Github 用户全部数据
     * @return 总得分
     */
    public static GithubUserScoreRespDTO calculate(GithubDetailedScoreReqDTO githubUserScoreReqDTO) {
        // 计算用户得分并保留两位小数
        double userScore = calculateUserScore(githubUserScoreReqDTO.getFollowers(),githubUserScoreReqDTO.getLifetimeReceivedSponsorshipValues());
        BigDecimal userScoreDecimal = BigDecimal.valueOf(userScore).setScale(2, RoundingMode.HALF_UP);

        // 计算仓库得分并保留两位小数
        double repoScore = calculateAllRepoScore(githubUserScoreReqDTO.getRepositories(), githubUserScoreReqDTO.getRepositoriesContributedTo());
        BigDecimal repoScoreDecimal = BigDecimal.valueOf(repoScore).setScale(2, RoundingMode.HALF_UP);

        // 计算拉取请求得分并保留两位小数
        double prsScore = calculateAllPrScore(githubUserScoreReqDTO.getPullRequests());
        BigDecimal prScoreDecimal = BigDecimal.valueOf(prsScore).setScale(2, RoundingMode.HALF_UP);

        // 计算问题得分并保留两位小数
        double issuesScore = calculateAllIssueScore(githubUserScoreReqDTO.getIssues());
        BigDecimal issueScoreDecimal = BigDecimal.valueOf(issuesScore).setScale(2, RoundingMode.HALF_UP);

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
     * @param followersNum Github 用户粉丝数
     * @param lifetimeReceivedSponsorshipValues Github 用户赞助数据
     * @return 用户基础数据得分
     */
    private static double calculateUserScore(GithubDetailedScoreReqDTO.Followers followersNum, GithubDetailedScoreReqDTO.LifetimeReceivedSponsorshipValues lifetimeReceivedSponsorshipValues) {
        if (followersNum == null || lifetimeReceivedSponsorshipValues == null) {
            return 0;
        }

        // followers 的得分计算
        double followersScore = calculateFunction(8, 1000, followersNum.getTotalCount());

        // lifetimeReceivedSponsorshipValues 的得分计算
        double lifetimeReceivedSponsorshipValuesScore = calculateFunction(2, 50, lifetimeReceivedSponsorshipValues.getTotalCount());

        return followersScore + lifetimeReceivedSponsorshipValuesScore;
    }

    /**
     * 计算 Github 用户仓库数据得分
     * @param repositories Github 用户仓库数据
     * @param repositoriesContributedTo Github 用户参与仓库数据
     * @return 用户总体仓库数据得分
     */
    private static double calculateAllRepoScore(GithubDetailedScoreReqDTO.Repositories repositories, GithubDetailedScoreReqDTO.RepositoriesContributedTo repositoriesContributedTo) {
        if (repositories == null || repositoriesContributedTo == null) {
            return 0;
        }

        // repositories 的得分计算
        double repositoriesScore = calculateFunction(3, 10, repositories.getTotalCount());

        // user repositories 的得分计算
        double userRepositoriesScore = calculateRepoScore(17, new ArrayList<>(repositories.getNodes().subList(0, 3)));

        // repositoriesContributedTo 的得分计算
        double repositoriesContributedToScore = calculateFunction(5, 10, repositories.getTotalCount());

        // User repositoriesContributedTo 的得分计算
        double userRepositoriesContributedToScore = calculateRepoScore(25, new ArrayList<>(repositoriesContributedTo.getNodes().subList(0, 3)));

        return repositoriesScore + userRepositoriesScore + repositoriesContributedToScore + userRepositoriesContributedToScore;
    }

    /**
     * 计算 Github 用户仓库数据得分
     * @param maxValue 最大得分
     * @param repos Github 用户仓库数据
     * @return 用户仓库数据得分
     */
    private static double calculateRepoScore(double maxValue, List<GithubDetailedScoreReqDTO.Repository> repos) {
        if (repos == null || repos.isEmpty()) {
            return 0;
        }

        double totalScore = 0;
        double MaxStargazerCountScore = maxValue * 0.2 / repos.toArray().length;
        double MaxForkScore = maxValue * 0.3 / repos.toArray().length;
        double MaxPullRequests = maxValue * 0.3 / repos.toArray().length;
        double MaxOpenIssuesScore = maxValue * 0.1 / repos.toArray().length;
        double MaxWatchesScore = maxValue * 0.1 / repos.toArray().length;
        for (GithubDetailedScoreReqDTO.Repository repo : repos) {
            // stars 的得分计算
            double starsScore = calculateFunction(MaxStargazerCountScore, 5000, repo.getStargazerCount());

            // forks 的得分计算
            double forkScore = calculateFunction(MaxForkScore, 200, repo.getForkCount());

            // pullRequests 的得分计算
            double pullRequestsScore = calculateFunction(MaxPullRequests, 1000, repo.getPullRequests().getTotalCount());

            // openIssues 的得分计算
            double openIssuesScore = calculateFunction(MaxOpenIssuesScore, 500, repo.getIssues().getTotalCount());

            // watches 的得分计算
            double watchesScore = calculateFunction(MaxWatchesScore, 500, repo.getWatchers().getTotalCount());

            totalScore += starsScore + forkScore + pullRequestsScore + openIssuesScore + watchesScore;
        }
        return totalScore;
    }


    /**
     * 计算 Github 用户总体 prs 数据得分
     * @param prs Github 用户 prs 数据
     * @return 用户总体 prs 数据得分
     */
    private static double calculateAllPrScore(GithubDetailedScoreReqDTO.PullRequests prs) {
        if (prs == null) {
            return 0;
        }

        // pull 质量计算
        double calculatePrScore = calculatePrScore(prs.getNodes());
        // pr 数量计算
        double calculatePrCountScore = calculateFunction(5, 500, prs.getTotalCount());

        return calculatePrScore + calculatePrCountScore;
    }

    /**
     * 计算 Github 用户 pr 数据得分
     *
     * @param pullRequests Github 用户 pr 数据
     * @return 用户 pr 数据得分
     */
    private static double calculatePrScore(List<GithubDetailedScoreReqDTO.PullRequest> pullRequests) {
        if (pullRequests == null || pullRequests.isEmpty()) {
            return 0;
        }

        // 过滤出状态为 MERGED 的拉取请求列表
        List<GithubDetailedScoreReqDTO.PullRequest> mergedPullRequests = pullRequests.stream()
                .filter(pr -> "MERGED".equals(pr.getState()))
                .toList();

        double totalScore = 0;
        // 根据仅包含 MERGED 状态的拉取请求数量计算分数
        double MaxCommitCountScore = (double) 25 * 0.1 / mergedPullRequests.size();
        double MaxRepoScore = (double) 25 * 0.9 / mergedPullRequests.size();
        for (GithubDetailedScoreReqDTO.PullRequest pr : mergedPullRequests) {
            // commit 的得分计算
            double commitScore = calculateFunction(MaxCommitCountScore, 10, pr.getCommits().getTotalCount());
            // repo 的得分计算
            double repoScore = calculateRepoScore(MaxRepoScore, Collections.singletonList(pr.getBaseRepository()));

            totalScore += commitScore + repoScore;
        }
        return totalScore;
    }


    /**
     * 计算 Github 用户总体 issues 数据得分
     * @param issues Github 用户 issue 数据
     * @return 用户总体 issues 数据得分
     */
    private static double calculateAllIssueScore(GithubDetailedScoreReqDTO.Issues issues) {
        if (issues == null) {
            return 0;
        }

        // issues 质量得分
        double calculateIssueScore = calculateIssueScore(issues.getNodes());
        // issues 数量得分
        double calculateIssueAmountScore = calculateFunction(2, 500, issues.getTotalCount());

        return calculateIssueScore + calculateIssueAmountScore;
    }

    /**
     * 计算 Github 用户 issue 数据得分
     *
     * @param issues Github 用户 issue 数据
     * @return 用户 issues 数据得分
     */
    private static double calculateIssueScore(List<GithubDetailedScoreReqDTO.Issue> issues) {
        if (issues == null || issues.isEmpty()) {
            return 0;
        }

        List<GithubDetailedScoreReqDTO.Repository> repos = issues.stream().map(GithubDetailedScoreReqDTO.Issue::getRepository).toList();
        return calculateRepoScore(8, repos);
    }
}
