package com.nine.project.analyze.controller;

import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;
import com.nine.project.analyze.service.GithubUserScoreService;
import com.nine.project.framework.result.Result;
import com.nine.project.framework.web.Results;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
    @GetMapping("/api/analyze/score/{githubUserId}")
    public Result<GithubUserScoreRespDTO> getUser(@PathVariable String githubUserId) {
        return Results.success(githubUserScoreService.getGithubUserScore(githubUserId));
    }


    /**
     * 添加/更新用户分数猜测接口
     */
    @PostMapping("/api/analyze/score")
    public Result<GithubUserScoreRespDTO> addUser(@RequestBody GithubUserScoreReqDTO requestParams) {
        return Results.success(githubUserScoreService.generateScore(requestParams));
    }
}
