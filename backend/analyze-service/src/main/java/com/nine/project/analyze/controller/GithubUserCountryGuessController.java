package com.nine.project.analyze.controller;

import com.nine.project.analyze.dto.req.GithubUserCountryReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserCountryRespDTO;
import com.nine.project.analyze.service.GithubUserCountryGuessService;
import com.nine.project.framework.result.Result;
import com.nine.project.framework.web.Results;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户所在国家/地区猜测接口控制层
 */
@RestController
@RequiredArgsConstructor
public class GithubUserCountryGuessController {


    private final GithubUserCountryGuessService githubUserCountryGuessService;

    /**
     * 查询所有已存在国家
     */
    @GetMapping("/api/analyze/country/exist")
    public Result<List<String>> getUser() {
        return Results.success(githubUserCountryGuessService.getExistNation());
    }


    /**
     * 查询对于 githubUserId 的用户所在国家/地区猜测接口
     */
    @GetMapping("/api/analyze/country/{login}")
    public Result<GithubUserCountryRespDTO> getUser(@PathVariable String login) {
        return Results.success(githubUserCountryGuessService.getGithubUserCountryGuessByGithubUserId(login));
    }


    /**
     * 新增/更新用户所在国家/地区猜测接口
     */
    @PostMapping("/api/analyze/country")
    public Result<GithubUserCountryRespDTO> addUser(@RequestBody GithubUserCountryReqDTO requestParams) {
        return Results.success(githubUserCountryGuessService.create(requestParams));
    }
}
