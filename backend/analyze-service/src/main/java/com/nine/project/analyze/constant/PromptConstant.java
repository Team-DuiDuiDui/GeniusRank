package com.nine.project.analyze.constant;

import com.nine.project.framework.exception.ClientException;
import lombok.Getter;

/**
 * Prompt 常量类
 */
public class PromptConstant {

    @Getter
    public enum PromptType {
        STREAM(1, "steam"),
        SYNC(2, "sync");

        private final int code;
        private final String description;

        PromptType(int code, String description) {
            this.code = code;
            this.description = description;
        }

        // 根据 code 获取 description
        public static String fromCode(int code) {
            for (PromptType type : PromptType.values()) {
                if (type.getCode() == code) {
                    return type.description;
                }
            }
            throw new ClientException("No matching constant for [" + code + "]");
        }
    }
}
