package com.nine.project.analyze.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nine.project.analyze.dao.entity.PromptDO;
import com.nine.project.analyze.service.PromptService;
import com.nine.project.framework.result.Result;
import com.nine.project.framework.web.Results;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Prompt 控制层
 */
@RestController
@RequiredArgsConstructor
public class PromptController {

    private final PromptService promptService;

    /**
     * 查询对于 id 的 Prompt 接口
     */
    @GetMapping("/api/analyze/prompt/{id}")
    public Result<PromptDO> getUser(@PathVariable Long id) {
        return Results.success(promptService.getById(id));
    }

    /**
     * 查询所有 Prompt 接口
     */
    @GetMapping("/api/analyze/prompt/list")
    public Result<IPage<PromptDO>> listUsers(@RequestParam(defaultValue = "1") Integer pageNum,
                                             @RequestParam(defaultValue = "10") Integer pageSize) {
        return Results.success(promptService.page(new Page<>(pageNum, pageSize)));
    }

    /**
     * 新增 Prompt 接口
    */
    @PostMapping("/api/analyze/prompt")
    public Result<Void> addUser(@RequestBody PromptDO prompt) {
        promptService.save(prompt);
        return Results.success();
    }

    /**
     * 更新 Prompt 接口
     */
    @PutMapping("/api/analyze/prompt")
    public Result<Void> updateUser(@RequestBody PromptDO prompt) {
        promptService.updateById(prompt);
        return Results.success();
    }

    /**
     * 删除 Prompt 接口
     */
    @DeleteMapping("/api/analyze/prompt/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        promptService.removeById(id);
        return Results.success();
    }
}
