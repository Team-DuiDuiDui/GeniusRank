package com.nine.project.analyze.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.nine.project.analyze.dao.entity.PromptDO;

/**
 * Prompt 接口层
 */
public interface PromptService extends IService<PromptDO> {

    /**
     * 根据类型获取 Prompt
     *
     * @return Prompt
     */
    PromptDO getPromptByType(int type);

    /**
     * 根据类型获取 Prompt
     *
     * @return Prompt
     */
    String getPromptTextByType(int type);

    /**
     * 更新 Prompt
     * @param prompt Prompt
     */
    void update(PromptDO prompt);

    /**
     * 删除 Prompt
     * @param id id
     */
    void remove(Long id);

    /**
     * 创建 Prompt
     * @param prompt Prompt
     */
    void create(PromptDO prompt);
}
