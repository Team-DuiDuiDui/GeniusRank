package com.nine.project.analyze.mq.event;

import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * 持久化分数和开发者领域事件
 */
@Data
@Builder
@AllArgsConstructor
public class SaveScoreAndTypeEvent implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    /**
     *  用户的分数请求体
     */
    private GithubUserScoreReqDTO requestParams;

    /**
     *  用户的分数响应体
     */
    private GithubUserScoreRespDTO scores;
}