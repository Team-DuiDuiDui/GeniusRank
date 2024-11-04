package com.nine.project.analyze.mq.produce;

import cn.hutool.core.lang.UUID;
import cn.hutool.core.util.StrUtil;
import com.alibaba.fastjson.JSON;
import com.nine.project.analyze.constant.RocketMQConstant;
import com.nine.project.analyze.mq.event.GeneralMessageEvent;
import com.nine.project.analyze.mq.event.SaveDetailedScoreAndTypeEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.rocketmq.client.producer.SendResult;
import org.apache.rocketmq.common.message.MessageConst;
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

/**
 * 持久化分数和开发者领域生产者
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SaveDetailedScoreAndTypeProducer {

    private final RocketMQTemplate rocketMQTemplate;

    /**
     * 发送邮箱验证码信息
     *
     * @param messageSendEvent 普通消息发送事件，自定义对象，最终都会序列化为字符串
     */
    public void sendMessage(SaveDetailedScoreAndTypeEvent messageSendEvent) {
        SendResult sendResult;
        try {
            String keys = UUID.randomUUID().toString();
            StringBuilder destinationBuilder = StrUtil.builder().append(RocketMQConstant.TOPIC_KEY);
            destinationBuilder.append(":").append(RocketMQConstant.DETAILED_DEVELOP_TYPE_TAG);

            // 封装一下发送的信息
            String jsonString = JSON.toJSONString(messageSendEvent);
            GeneralMessageEvent generalMessageEvent = new GeneralMessageEvent(jsonString, keys);

            Message<?> message = MessageBuilder
                    .withPayload(generalMessageEvent)
                    .setHeader(MessageConst.PROPERTY_KEYS, keys)
                    .setHeader(MessageConst.PROPERTY_TAGS, RocketMQConstant.DETAILED_DEVELOP_TYPE_TAG)
                    .build();
            sendResult = rocketMQTemplate.syncSend(
                    destinationBuilder.toString(),
                    message,
                    2000L
            );
            log.info("[Detail Save] 消息发送结果：{}，消息ID：{}，消息Keys：{}", sendResult.getSendStatus(), sendResult.getMsgId(), keys);
        } catch (Throwable ex) {
            log.error("[Detail Save] 消息发送失败，消息体：{}", JSON.toJSONString(messageSendEvent), ex);
            throw ex;
        }
    }
}
