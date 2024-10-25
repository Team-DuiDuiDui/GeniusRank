package com.nine.project.analyze.controller;


import com.esotericsoftware.minlog.Log;
import com.nine.project.analyze.constant.PromptConstant;
import com.nine.project.analyze.dto.req.ChatReqDTO;
import com.nine.project.analyze.service.PromptService;
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



/**
 * AI 通用方法
 */
@RestController
@RequiredArgsConstructor
public class AiController {

    private final AiManager aiManager;

    private final PromptService promptService;

    /**
     * 同步请求 Chat
     * @param chatReqDTO 聊天请求 DTO
     * @return AI 响应信息
     */
    @PostMapping("/api/analyze/chat/sync")
    public Result<String> chatSync(@RequestBody ChatReqDTO chatReqDTO) {
        String syncPrompt = promptService.getPromptTextByType(PromptConstant.PromptType.SYNC.getCode());
        return Results.success(aiManager.doSyncRequest(syncPrompt, chatReqDTO.getMessage()));
    }

    /**
     * 流式请求 Chat
     * @param chatReqDTO 聊天请求 DTO
     * @return AI 响应信息(流式)
     */
    @PostMapping("/api/analyze/chat/stream")
    public SseEmitter chatStream(@RequestBody ChatReqDTO chatReqDTO) {
        Log.info("hello");
        String streamPrompt = promptService.getPromptTextByType(PromptConstant.PromptType.STREAM.getCode());
        Flowable<ModelData> modelDataFlowable = aiManager.doStreamRequest(streamPrompt, chatReqDTO.getMessage());

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