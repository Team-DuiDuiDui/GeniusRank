package com.nine.project.analyze.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nine.project.analyze.dao.entity.PromptDO;
import com.nine.project.analyze.dao.mapper.PromptMapper;
import com.nine.project.analyze.service.PromptService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


/**
 * Prompt 服务接口实现层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PromptServiceImpl extends ServiceImpl<PromptMapper, PromptDO> implements PromptService {
}
