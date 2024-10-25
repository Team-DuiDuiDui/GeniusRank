package com.nine.project.analyze.dao.entity;


import com.baomidou.mybatisplus.annotation.TableName;
import com.nine.project.framework.database.base.BaseDO;
import lombok.Data;

/**
 * Prompt 持久层实体
 */
@Data
@TableName("t_prompt")
public class PromptDO extends BaseDO {
    /**
     * id
     */
    private Long id;

    /**
     * prompt 名字
     */
    private String promptName;

    /**
     * prompt 内容
     */
    private String promptText;
}
