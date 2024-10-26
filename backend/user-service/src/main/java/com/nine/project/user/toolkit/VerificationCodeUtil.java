package com.nine.project.user.toolkit;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;


/**
 * 验证码工具类
 */
public class VerificationCodeUtil {

    /**
     * 发送验证码到指定邮箱
     *
     * @param mailSender  邮件发送器
     * @param sendFrom    发件人邮箱地址
     * @param sendTo      收件人邮箱地址
     * @param projectName 项目名称
     * @param code        验证码
     * @return SimpleMailMessage 邮件消息对象
     */
    public static MimeMessage setMailMessage(JavaMailSender mailSender, String projectName, String sendFrom, String sendTo, String code) throws MessagingException {
        // 创建 MIME 邮件
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // true 表示可以发送 HTML 邮件

        // 设置发件人
        helper.setFrom(sendFrom + " (" + projectName + ")");

        // 设置收件人
        helper.setTo(sendTo);

        // 设置邮件主题
        String subjectText = "您本次的验证码为" + code;
        helper.setSubject(subjectText);

        // 设置邮件内容（HTML 格式）
        String mailText = "<html><body>"
                + "<h2>尊敬的用户：</h2>"
                + "<p>感谢您使用 <strong>" + projectName + "</strong> 平台！</p>"
                + "<p>您的验证码为：<strong style='font-size: 24px; color: #ff0000;'>" + code + "</strong></p>"
                + "<p>验证码将在<strong>十分钟</strong>后失效，请尽快进行验证，并不要透露给他人。</p>"
                + "<p>祝您生活愉快！</p>"
                + "</body></html>";
        helper.setText(mailText, true); // true 表示邮件内容为 HTML 格式

        return message;
    }
}
