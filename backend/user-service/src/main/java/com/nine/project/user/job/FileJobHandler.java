package com.nine.project.user.job;


import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.nine.project.user.dao.entity.UserDO;
import com.nine.project.user.dao.mapper.UserMapper;
import com.nine.project.user.toolkit.OssUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

/**
 * 文件处理定时任务
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FileJobHandler {

    private final UserMapper userMapper;
    private final OssUtil ossUtil;

    /**
     * 每天凌晨 2 点 30 定时删除未使用图片，即数据库中不存在的图片
     */
    @Scheduled(cron = "0 30 2 * * ?")
    public void processUnUsedFile() {
        log.info("processUnUsedFile 开始执行 {}", LocalDateTime.now());

        // 查询所有用户并提取所有已使用的文件名
        List<String> usedFileNames = userMapper.selectList(Wrappers.emptyWrapper()).stream()
                .map(UserDO::getAvatar)
                .filter(Objects::nonNull)
                .toList();

        // 获取所有存储的文件名（阿里云OSS / 本地存储）
        List<String> allStoredFileNames = ossUtil.getFileNames();

        // 找出未使用的文件
        List<String> unusedFileNames = allStoredFileNames.stream()
                .filter(fileName -> !usedFileNames.contains(fileName))
                .toList();

        // 删除未使用的文件
        unusedFileNames.forEach(ossUtil::deleteFile);

        log.info("processUnUsedFile 执行完成 {}", LocalDateTime.now());
    }
}