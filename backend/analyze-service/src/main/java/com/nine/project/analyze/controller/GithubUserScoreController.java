package com.nine.project.analyze.controller;

import com.nine.project.analyze.dto.req.GithubDetailedScoreReqDTO;
import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRankRespDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;
import com.nine.project.analyze.service.GithubUserScoreService;
import com.nine.project.framework.result.Result;
import com.nine.project.framework.web.Results;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户分数接口控制层
 */
@RestController
@RequiredArgsConstructor
public class GithubUserScoreController {


    private final GithubUserScoreService githubUserScoreService;

    /**
     * 查询对于 githubUserId 的用户分数接口
     */
    @GetMapping("/api/analyze/score/{login}")
    public Result<GithubUserScoreRespDTO> getUserScore(@PathVariable String login) {
        return Results.success(githubUserScoreService.getGithubUserScore(login));
    }


    /**
     * 添加/更新简单用户分数猜测接口（无需登录）
     */
    @PostMapping("/api/analyze/score")
    public Result<GithubUserScoreRespDTO> addUserScore(@RequestBody GithubUserScoreReqDTO requestParams) {
        return Results.success(githubUserScoreService.generateScore(requestParams));
    }

    /**
     * 添加/更新详细用户分数猜测接口（需要登录）
     */
    @PostMapping("/api/analyze/score/detailed")
    public Result<GithubUserScoreRespDTO> addUserDetailedScore(@RequestBody GithubDetailedScoreReqDTO requestParams) {
        return Results.success(githubUserScoreService.generateScoreDetail(requestParams));
    }

    /**
     * 获取用户分数接口排行榜（无需登录）
     */
    @GetMapping("/api/analyze/score/rank")
    public Result<List<GithubUserScoreRankRespDTO>> getUserScoreRank(@RequestParam(defaultValue = "10") Integer size,
                                                                     @RequestParam(required = false) String nation,
                                                                     @RequestParam(required = false) String type) {
        return Results.success(githubUserScoreService.getGithubUserScoreRank(size, nation, type));
    }
}
