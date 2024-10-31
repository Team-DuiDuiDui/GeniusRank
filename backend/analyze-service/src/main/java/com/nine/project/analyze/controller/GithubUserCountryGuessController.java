package com.nine.project.analyze.controller;

import com.nine.project.analyze.dto.req.GithubUserCountryReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserCountryRespDTO;
import com.nine.project.analyze.service.GithubUserCountryGuessService;
import com.nine.project.framework.result.Result;
import com.nine.project.framework.web.Results;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 用户所在国家/地区猜测接口控制层
 */
@RestController
@RequiredArgsConstructor
public class GithubUserCountryGuessController {


    private final GithubUserCountryGuessService githubUserCountryGuessService;

    /**
     * 查询对于 githubUserId 的用户所在国家/地区猜测接口
     */
    @GetMapping("/api/analyze/country/{githubUserId}")
    public Result<GithubUserCountryRespDTO> getUser(@PathVariable String githubUserId) {
        return Results.success(githubUserCountryGuessService.getGithubUserCountryGuessByGithubUserId(githubUserId));
    }


    /**
     * 新增/更新用户所在国家/地区猜测接口
     */
    @PostMapping("/api/analyze/country")
    public Result<GithubUserCountryRespDTO> addUser(@RequestBody GithubUserCountryReqDTO requestParams) {
        return Results.success(githubUserCountryGuessService.create(requestParams));
    }
}
