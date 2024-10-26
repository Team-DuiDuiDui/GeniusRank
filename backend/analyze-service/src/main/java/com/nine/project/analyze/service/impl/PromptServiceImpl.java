package com.nine.project.analyze.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nine.project.analyze.constant.PromptConstant;
import com.nine.project.analyze.dao.entity.PromptDO;
import com.nine.project.analyze.dao.mapper.PromptMapper;
import com.nine.project.analyze.service.PromptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

import static com.nine.project.analyze.constant.RedisCacheConstant.PROMPT_TEXT_EXPIRE_TIME;
import static com.nine.project.analyze.constant.RedisCacheConstant.PROMPT_TEXT_KEY;


/**
 * Prompt 服务接口实现层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PromptServiceImpl extends ServiceImpl<PromptMapper, PromptDO> implements PromptService {

    private final StringRedisTemplate stringRedisTemplate;

    @Override
    public PromptDO getPromptByType(int type) {
        LambdaQueryWrapper<PromptDO> queryWrapper = Wrappers.lambdaQuery(PromptDO.class)
                .eq(PromptDO::getPromptType, type);
        return this.getOne(queryWrapper);
    }

    @Override
    public String getPromptTextByType(int type) {
        // 从缓存中获取
        String promptText = stringRedisTemplate.opsForValue().get(PROMPT_TEXT_KEY + PromptConstant.PromptType.fromCode(type));
        if (promptText != null) {
            return promptText;
        }

        // 如果缓存中没有，则从数据库中获取
        LambdaQueryWrapper<PromptDO> queryWrapper = Wrappers.lambdaQuery(PromptDO.class)
                .eq(PromptDO::getPromptType, type);
        PromptDO promptDO = this.getOne(queryWrapper);

        // 将获取到的 promptText 存入缓存
        stringRedisTemplate.opsForValue().set(PROMPT_TEXT_KEY + PromptConstant.PromptType.fromCode(type), promptDO.getPromptText(),PROMPT_TEXT_EXPIRE_TIME, TimeUnit.SECONDS);

        return promptDO.getPromptText();
    }

    @Override
    public void update(PromptDO prompt) {
        PromptDO promptDO = this.getById(prompt.getId());

        // 删除缓存
        stringRedisTemplate.delete(PROMPT_TEXT_KEY + PromptConstant.PromptType.fromCode(promptDO.getPromptType()));

        // 更新数据库
        this.updateById(prompt);
    }

    @Override
    public void remove(Long id) {
        PromptDO promptDO = this.getById(id);

        // 删除缓存
        stringRedisTemplate.delete(PROMPT_TEXT_KEY + PromptConstant.PromptType.fromCode(promptDO.getPromptType()));

        // 删除数据库
        this.removeById(id);
    }

    @Override
    public void create(PromptDO prompt) {
        // 校验 Prompt 类型
        PromptConstant.PromptType.fromCode(prompt.getPromptType());
        this.save(prompt);
    }
}
