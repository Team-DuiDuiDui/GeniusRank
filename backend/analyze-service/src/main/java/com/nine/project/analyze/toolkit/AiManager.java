package com.nine.project.analyze.toolkit;


import com.nine.project.framework.exception.RemoteException;
import com.zhipu.oapi.ClientV4;
import com.zhipu.oapi.Constants;
import com.zhipu.oapi.service.v4.model.*;
import io.reactivex.Flowable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static com.nine.project.framework.errorcode.BaseErrorCode.AI_SERVICE_ERROR;

/**
 * 智谱AI通用方法
 */
@Component
@RequiredArgsConstructor
public class AiManager {

    private final ClientV4 client;

    public static final float TEMPERATURE = 0.95f;

    public static final String SYNC_PROMPT = "请回复用户的问题，回复内容不要超过100字。";

    /**
     * 流式请求
     *
     * @param systemMessage 系统信息
     * @param userMessage 用户信息
     * @return AI响应信息(流式)
     */
    public Flowable<ModelData> doStreamRequest(String systemMessage, String userMessage) {
        return doStreamRequest(BuildMessage(systemMessage, userMessage), TEMPERATURE);
    }

    /**
     * 同步请求
     *
     * @param systemMessage 系统信息
     * @param userMessage 用户信息
     * @return AI响应信息
     */
    public String doSyncRequest(String systemMessage, String userMessage) {
        return doSyncRequest(BuildMessage(systemMessage, userMessage), TEMPERATURE);
    }

    /**
     * 流式请求方法
     *
     * @param aiChatMessages AI聊天消息
     * @param temperature 随机性
     * @return AI响应信息(流式)
     */
    public Flowable<ModelData> doStreamRequest(List<ChatMessage> aiChatMessages, Float temperature) {
        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
                .model(Constants.ModelChatGLM4)
                .stream(Boolean.TRUE)
                .invokeMethod(Constants.invokeMethod)
                .temperature(temperature)
                .messages(aiChatMessages)
                .build();
        ModelApiResponse modelApiResponse = client.invokeModelApi(chatCompletionRequest);
        return modelApiResponse.getFlowable();
    }

    /**
     * 同步请求方法
     *
     * @param aiChatMessages AI聊天消息
     * @param temperature 随机性
     * @return AI响应信息
     */
    public String doSyncRequest(List<ChatMessage> aiChatMessages, Float temperature) {
        ChatCompletionRequest chatCompletionRequest = ChatCompletionRequest.builder()
                .model(Constants.ModelChatGLM4)
                .stream(Boolean.FALSE)
                .invokeMethod(Constants.invokeMethod)
                .temperature(temperature)
                .messages(aiChatMessages)
                .build();
        try {
            ModelApiResponse invokeModelApiResp = client.invokeModelApi(chatCompletionRequest);
            return invokeModelApiResp.getData().getChoices().get(0).getMessage().getContent().toString();
        } catch (Exception e) {
            throw new RemoteException(AI_SERVICE_ERROR);
        }
    }

    /**
     * 构建请求信息
     * @param systemMessage 系统信息
     * @param userMessage 用户信息
     *
     * @return AI聊天消息
     */
    private List<ChatMessage> BuildMessage(String systemMessage, String userMessage) {
        List<ChatMessage> aiChatMessages = new ArrayList<>();
        ChatMessage systemChatMessage = new ChatMessage(ChatMessageRole.SYSTEM.value(), systemMessage);
        ChatMessage userChatMessage = new ChatMessage(ChatMessageRole.USER.value(), userMessage);
        aiChatMessages.add(systemChatMessage);
        aiChatMessages.add(userChatMessage);
        return aiChatMessages;
    }
}