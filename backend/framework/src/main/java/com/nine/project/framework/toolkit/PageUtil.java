package com.nine.project.framework.toolkit;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.nine.project.framework.database.page.PageRequest;
import com.nine.project.framework.database.page.PageResponse;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 分页工具类
 */
public class PageUtil {

    /**
     * {@link PageRequest} to {@link Page}
     */
    public static <T> Page<T> convert(PageRequest pageRequest) {
        return convert(pageRequest.getCurrent(), pageRequest.getSize());
    }

    /**
     * {@link PageRequest} to {@link Page}
     */
    public static <T> Page<T> convert(long current, long size) {
        return new Page<>(current, size);
    }

    /**
     * {@link IPage} to {@link PageResponse}
     */
    public static <T> PageResponse<T> convert(IPage<T> iPage) {
        return PageResponse.<T>builder()
                .current(iPage.getCurrent())
                .size(iPage.getSize())
                .records(iPage.getRecords())
                .total(iPage.getTotal())
                .build();
    }

    /**
     * {@link IPage} to {@link PageResponse}
     */
    public static <TARGET, ORIGINAL> PageResponse<TARGET> convert(IPage<ORIGINAL> iPage, Class<TARGET> targetClass) {
        List<TARGET> convertedRecords = iPage.getRecords().stream()
                .map(original -> BeanUtil.convert(original, targetClass))
                .toList();
        return PageResponse.<TARGET>builder()
                .current(iPage.getCurrent())
                .size(iPage.getSize())
                .records(convertedRecords)
                .total(iPage.getTotal())
                .build();
    }

    /**
     * {@link IPage} to {@link PageResponse}
     */
    public static <TARGET, ORIGINAL> PageResponse<TARGET> convert(IPage<ORIGINAL> iPage, Function<? super ORIGINAL, ? extends TARGET> mapper) {
        List<TARGET> targetDataList = iPage.getRecords().stream()
                .map(mapper)
                .collect(Collectors.toList());
        return PageResponse.<TARGET>builder()
                .current(iPage.getCurrent())
                .size(iPage.getSize())
                .records(targetDataList)
                .total(iPage.getTotal())
                .build();
    }
}