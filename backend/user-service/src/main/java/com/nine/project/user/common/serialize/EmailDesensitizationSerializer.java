package com.nine.project.user.common.serialize;

import cn.hutool.core.util.DesensitizedUtil;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

/**
 * 邮箱脱敏反序列化
 */
public class EmailDesensitizationSerializer extends JsonSerializer<String> {

    @Override
    public void serialize(String email, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        String emailDesensitization = DesensitizedUtil.email(email);
        jsonGenerator.writeString(emailDesensitization);
    }
}
