package com.nine.project.user.mq.consumer;

import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONException;
import com.nine.project.framework.exception.RemoteException;
import com.nine.project.user.common.constant.RocketMQConstant;
import com.nine.project.user.mq.event.GeneralMessageEvent;
import com.nine.project.user.mq.event.VerificationCodeEvent;
import com.nine.project.user.toolkit.VerificationCodeUtil;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import static com.nine.project.framework.errorcode.BaseErrorCode.SMS_SERVICE_ERROR;

/**
 * 发送邮箱验证码消费者
 */
@Lazy
@Slf4j
@Component
@RequiredArgsConstructor
@RocketMQMessageListener(
        topic = RocketMQConstant.VERIFY_CODE_TOPIC,
        selectorExpression = RocketMQConstant.VERIFY_CODE_TAG,
        consumerGroup = RocketMQConstant.VERIFY_CODE_CONSUMER_GROUP
)
public class SendVerificationCodeCodeConsumer implements RocketMQListener<GeneralMessageEvent> {

    private final JavaMailSender javaMailSender;

    /**
     * 有关邮箱的配置信息
     */
    @Value("${spring.mail.username}")
    private String sendFrom; // 发送邮箱者
    @Value("${spring.mail.project-name}")
    private String projectName; // 项目名称

    @Override
    public void onMessage(GeneralMessageEvent message) {
        String jsonBody = message.getBody();
        VerificationCodeEvent verificationCodeEvent;

        // 尝试解析 JSON
        try {
            verificationCodeEvent = JSON.to(VerificationCodeEvent.class, jsonBody);
        } catch (JSONException e) {
            log.error("出现恶意请求，消息队列解析失败，消息内容：{}", jsonBody);
            return;
        }

        // 解析出邮件对象
        String sendTo = verificationCodeEvent.getEmail();
        String code = verificationCodeEvent.getCode();

        // 发送邮件逻辑
        try {
            MimeMessage mailMessage = VerificationCodeUtil.setMailMessage(javaMailSender, projectName, sendFrom, sendTo, code);
            javaMailSender.send(mailMessage);
        } catch (Exception e) {
            throw new RemoteException(SMS_SERVICE_ERROR);
        }

        log.info("邮件验证码异步发送成功，邮箱：{}，验证码：{}", sendTo, code);
    }
}
