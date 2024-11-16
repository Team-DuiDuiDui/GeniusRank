package com.nine.project.user.toolkit;

import cn.hutool.core.lang.UUID;
import com.nine.project.user.config.QiniuConfiguration;
import com.qiniu.http.Response;
import com.qiniu.storage.Configuration;
import com.qiniu.storage.UploadManager;
import com.qiniu.util.Auth;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * 七牛云对象存储文件服务
 */
@Slf4j
@AllArgsConstructor
public class QiniuUtil {

    private final QiniuConfiguration qiniuConfig;

    public String upload(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new RuntimeException("文件是空的");
        }
        // 创建上传token
        Auth auth = Auth.create(qiniuConfig.getAccessKey(), qiniuConfig.getSecretKey());
        String upToken = auth.uploadToken(qiniuConfig.getBucket());

        // 设置上传配置，Region要与存储空间所属的存储区域保持一致
        Configuration cfg = new Configuration();

        // 创建上传管理器
        UploadManager uploadManager = new UploadManager(cfg);

        String originalFilename = file.getOriginalFilename();
        // 构造文件目录和文件名
        assert originalFilename != null;
        String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
        String fileKey = qiniuConfig.getDirectory() + UUID.randomUUID() + suffix;

        // 上传文件
        Response response = uploadManager.put(file.getInputStream(), fileKey, upToken, null, null);

        // 返回文件url
        return qiniuConfig.getDomain() + fileKey;
    }
}

