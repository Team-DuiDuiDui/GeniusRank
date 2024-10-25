package com.nine.project.analyze.controller;


import com.esotericsoftware.minlog.Log;
import com.nine.project.analyze.dto.req.ChatReqDTO;
import com.nine.project.analyze.toolkit.AiManager;
import com.nine.project.framework.result.Result;
import com.nine.project.framework.web.Results;
import com.zhipu.oapi.service.v4.model.ModelData;
import io.micrometer.common.util.StringUtils;
import io.reactivex.Flowable;
import io.reactivex.schedulers.Schedulers;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import static com.nine.project.analyze.toolkit.AiManager.SYNC_PROMPT;


/**
 * AI 通用方法
 */
@RestController
@RequiredArgsConstructor
public class AiController {

    private final AiManager aiManager;

    /**
     * 同步请求 Chat
     * @param chatReqDTO 聊天请求 DTO
     * @return AI 响应信息
     */
    @PostMapping("/api/analyze/chat/sync")
    public Result<String> chatSync(@RequestBody ChatReqDTO chatReqDTO) {
        return Results.success(aiManager.doSyncRequest(SYNC_PROMPT, chatReqDTO.getMessage()));
    }

    /**
     * 流式请求 Chat
     * @param chatReqDTO 聊天请求 DTO
     * @return AI 响应信息(流式)
     */
    @PostMapping("/api/analyze/chat/stream")
    public SseEmitter chatStream(@RequestBody ChatReqDTO chatReqDTO) {
        Log.info("hello");
        Flowable<ModelData> modelDataFlowable = aiManager.doStreamRequest("你是一个开发者技术能力评估信息自动整理机器人，接下来我会给你一个 Github 用户的基础信息，比如在 GitHub 上有博客链接，甚至有一些用 GitHub 搭建的网站，也有一些在 GitHub 本身有账号相关介绍，你要结合这些基础信息来自动整理评估开发者技术能力", chatReqDTO.getMessage());

        SseEmitter sseEmitter = new SseEmitter();
        modelDataFlowable.observeOn(Schedulers.io())
                .map(modelData -> modelData.getChoices().get(0).getDelta().getContent())
                .filter(StringUtils::isNotBlank)
                .subscribe(
                        message -> {
                            try {
                                // 发送消息，这里直接发送整个消息字符串
                                sseEmitter.send(SseEmitter.event().data(message));
                            } catch (Exception e) {
                                sseEmitter.completeWithError(e);
                            }
                        },
                        sseEmitter::completeWithError, // 发生错误时，结束 SSE 连接
                        sseEmitter::complete // 数据流完成时，结束 SSE 连接
                );

        // 设置超时时间，例如 30 秒
        sseEmitter.onTimeout(sseEmitter::complete);
        sseEmitter.onCompletion(() -> {
            // 可以在这里进行清理工作
            Log.info("Bye!");
        });

        return sseEmitter;
    }
}