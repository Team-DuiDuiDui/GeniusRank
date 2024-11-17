package com.nine.project.user.controller;

import com.nine.project.framework.result.Result;
import com.nine.project.framework.web.Results;
import com.nine.project.user.dto.resp.UploadFileRespDTO;
import com.nine.project.user.toolkit.OssUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;


/**
 * 测试接口控制层
 */
@RestController
@RequiredArgsConstructor
public class CommonController {

    private final OssUtil ossUtil;

    /**
     * 测试 ping 接口
     */
    @GetMapping("/api/common/ping")
    public String ping() {
        return "pong!";
    }

    /**
     * time 接口
     */
    @GetMapping("/api/common/time")
    public long time() {
        return Instant.now().getEpochSecond();
    }

    /**
     * 文件上传
     *
     * @param file 文件
     * @return 文件路径/地址
     */
    @PostMapping("/api/common/upload")
    public Result<UploadFileRespDTO> upload(MultipartFile file) {
        return Results.success(ossUtil.upload(file));
    }

    /**
     * 获取文件
     *
     * @param filename 文件名
     * @param response 响应
     */
    @GetMapping("/api/common/files/{filename}")
    public void getFile(@PathVariable String filename, HttpServletResponse response) {
        // 获取项目的当前路径，并构建相对存储目录
        String currentPath = Paths.get("").toAbsolutePath().toString();
        String fileStorageLocation = currentPath + File.separator + "uploads";
        Path filePath = Paths.get(fileStorageLocation, filename).toAbsolutePath();

        // 检查文件是否存在
        if (Files.exists(filePath)) {
            try {
                // 设置响应内容类型，根据文件类型设置
                String contentType = Files.probeContentType(filePath);
                response.setContentType(contentType != null ? contentType : "application/octet-stream");

                // 设置 Content-Disposition 为 inline，以便在浏览器中查看
                response.setHeader("Content-Disposition", "inline; filename=\"" + filename + "\"");

                // 将文件写入响应
                Files.copy(filePath, response.getOutputStream());
                response.getOutputStream().flush();
            } catch (IOException e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}
