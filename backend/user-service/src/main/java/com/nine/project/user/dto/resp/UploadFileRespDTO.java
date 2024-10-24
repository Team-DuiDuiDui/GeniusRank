package com.nine.project.user.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 上传文件返回对象
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadFileRespDTO {

    /**
     * 文件路径/地址
     */
    private String fileName;
}
