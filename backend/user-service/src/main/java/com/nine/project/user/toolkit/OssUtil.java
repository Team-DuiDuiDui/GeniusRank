package com.nine.project.user.toolkit;


import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.aliyun.oss.OSSException;
import com.aliyun.oss.model.ListObjectsRequest;
import com.aliyun.oss.model.OSSObjectSummary;
import com.aliyun.oss.model.ObjectListing;
import com.nine.project.framework.exception.RemoteException;
import com.nine.project.framework.exception.ServiceException;
import com.nine.project.user.dto.resp.UploadFileRespDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import static com.nine.project.framework.errorcode.BaseErrorCode.OSS_SERVICE_ERROR;

/**
 * 阿里云 OSS 工具类
 */
@Lazy
@Slf4j
@Data
@AllArgsConstructor
public class OssUtil {

    private Boolean enabled; // 是否启用阿里云 OSS
    private String endpoint; // 阿里云 OSS（对象存储服务）的访问域名
    private String accessKeyId; // 用于访问 OSS 的标识用户的唯一标识符
    private String accessKeySecret; // 用于访问 OSS 的配对密钥
    private String bucketName; // OSS 中的存储空间名称
    private String domain; // 本地存储空间域名

    private final String IMAGE_INTERFACE_PATH ="/api/common/files/";

    /**
     * 文件上传
     *
     * @param file 要上传的文件
     * @return 上传后文件的 URL
     */
    public UploadFileRespDTO upload(MultipartFile file) {
        if (enabled) {
            return upload2AliOss(file);
        } else {
            return upload2Local(file);
        }
    }

    public UploadFileRespDTO upload2AliOss(MultipartFile file) {
        // 获取文件名和文件后缀
        String originalFilename = file.getOriginalFilename();
        String extension = Objects.requireNonNull(originalFilename).substring(originalFilename.lastIndexOf("."));
        // 生成文件名
        String filePix = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        String fileName = filePix + extension;

        // 创建 OSSClient 实例
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);

        // 上传文件
        try {
            ossClient.putObject(bucketName, fileName, new ByteArrayInputStream(file.getBytes()));
        } catch (Exception ex) {
            log.error("文件:{} 上传失败", fileName);
            throw new RemoteException(OSS_SERVICE_ERROR);
        } finally {
            ossClient.shutdown();
        }

        // 返回文件上传到OSS的URL
        StringBuilder stringBuilder = new StringBuilder("https://");
        stringBuilder
                .append(bucketName)
                .append(".")
                .append(endpoint)
                .append("/")
                .append(fileName);

        log.info("文件上传到:{}", stringBuilder);
        return new UploadFileRespDTO(stringBuilder.toString());
    }

    public UploadFileRespDTO upload2Local(MultipartFile file) {
        // 获取文件名和文件后缀
        String originalFilename = file.getOriginalFilename();
        String extension = Objects.requireNonNull(originalFilename).substring(originalFilename.lastIndexOf("."));
        // 生成文件名
        String filePix = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        String fileName = filePix + extension;

        // 获取项目的当前路径，并构建相对存储目录
        String currentPath = Paths.get("").toAbsolutePath().toString();
        String localDirectory = currentPath + File.separator + "uploads";
        File localDir = new File(localDirectory);
        if (!localDir.exists()) {
            boolean mkdir = localDir.mkdirs();
            if (!mkdir) {
                log.error("本地存储目录:{} 创建失败", localDirectory);
                throw new ServiceException("本地存储目录创建失败");
            }
        }

        try (FileOutputStream fos = new FileOutputStream(new File(localDir, fileName))) {
            fos.write(file.getBytes());
        } catch (IOException ex) {
            log.error("文件:{} 本地存储失败", fileName);
            throw new ServiceException("文件存储失败");
        }

        // 返回文件在本地的路径
        String filePath = domain + IMAGE_INTERFACE_PATH +  fileName;

        log.info("文件存储在本地:{}", filePath);
        return new UploadFileRespDTO(filePath);
    }

    /**
     * 文件删除
     *
     * @param fileName 要删除的文件名
     */
    public void deleteFile(String fileName) {
        if (enabled) {
            deleteAliOssFile(fileName);
        } else {
            deleteLocalFile(fileName);
        }
    }

    public void deleteAliOssFile(String fileName) {
        // 创建 OSSClient 实例
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);

        // 删除文件
        try {
            ossClient.deleteObject(bucketName, fileName);
            log.info("文件:{} 删除成功", fileName);
        } catch (OSSException e) {
            log.error("文件:{} 删除失败", fileName);
            throw new RemoteException(OSS_SERVICE_ERROR);
        } finally {
            ossClient.shutdown();
        }
    }

    public void deleteLocalFile(String filePath) {
        // 截取后面的文件名
        String fileName = filePath.substring(filePath.lastIndexOf("/") + 1);

        // 获取项目的当前路径，并构建绝对存储目录
        String currentPath = Paths.get("").toAbsolutePath().toString();
        String localDirectory = currentPath + File.separator + "uploads";
        filePath = localDirectory + File.separator + fileName;
        // 删除本地文件
        try {
            FileSystemUtils.deleteRecursively(new File(filePath));
            log.info("本地文件:{} 已成功删除", filePath);
        } catch (Exception e) {
            log.error("本地文件:{} 删除失败", filePath);
            throw new ServiceException("文件删除失败");
        }
    }

    /**
     * 获取所有存储的文件名
     *
     * @return 所有存储的文件名 (阿里云OSS / 本地存储)
     */
    public List<String> getFileNames() {
        List<String> fileNames;

        if (enabled) {
            // 从 OSS 获取所有文件名
            fileNames = getFileNamesFromOss();
        } else {
            // 从本地获取所有文件名
            fileNames = getFileNamesFromLocal();
        }
        return fileNames;
    }

    private List<String> getFileNamesFromOss() {
        List<String> fileNames = new ArrayList<>();
        OSS ossClient = new OSSClientBuilder().build(endpoint, accessKeyId, accessKeySecret);

        try {
            // 创建 ListObjectsRequest，指定 bucketName
            ListObjectsRequest listObjectsRequest = new ListObjectsRequest(bucketName);
            // 可选：设置前缀筛选条件
            listObjectsRequest.setPrefix(""); // 如果需要筛选特定的文件，可以在这里设置

            ObjectListing objectListing = ossClient.listObjects(listObjectsRequest);
            for (OSSObjectSummary objectSummary : objectListing.getObjectSummaries()) {
                // 将文件名添加到返回列表中
                fileNames.add(objectSummary.getKey());
            }
        } catch (Exception e) {
            log.error("列出 OSS 文件失败", e);
        } finally {
            ossClient.shutdown();
        }

        return fileNames;
    }

    private List<String> getFileNamesFromLocal() {
        List<String> fileNames = new ArrayList<>();
        String localDirectory = Paths.get("").toAbsolutePath() + File.separator + "uploads";
        File dir = new File(localDirectory);
        if (dir.exists() && dir.isDirectory()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File file : files) {
                    String filePath = domain + IMAGE_INTERFACE_PATH + file.getName();
                    fileNames.add(filePath);
                }
            }
        }
        return fileNames;
    }
}
