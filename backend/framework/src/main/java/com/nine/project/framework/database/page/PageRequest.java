package com.nine.project.framework.database.page;

import lombok.Data;

/**
 * 分页请求对象
 *
 * <p> {@link PageRequest}、{@link PageResponse}
 */
@Data
public class PageRequest {

    /**
     * 当前页
     */
    private Long current = 1L;

    /**
     * 每页显示条数
     */
    private Long size = 10L;
}