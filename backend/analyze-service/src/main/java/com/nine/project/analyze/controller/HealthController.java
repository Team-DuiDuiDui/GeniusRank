package com.nine.project.analyze.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 测试接口控制层
 */
@RestController
@RequiredArgsConstructor
public class HealthController {

    /**
     * 测试 ping 接口
     */
    @GetMapping("/api/analyze/ping")
    public String ping() {
        return "pong!";
    }
}
