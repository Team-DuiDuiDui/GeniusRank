package com.nine.project.user.mq.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 普通消息发送事件
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeneralMessageEvent {

    /**
     * 消息内容，可以是 JSON 或者其它字符串
     */
    private String body;

    /**
     * RocketMQ 消息唯一标识，可用作幂等或其它用途
     */
    private String keys;
}
