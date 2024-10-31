package com.nine.project.analyze.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.nine.project.analyze.dao.entity.GithubUserCountryGuessDO;
import com.nine.project.analyze.dao.mapper.GithubUserCountryGuessMapper;
import com.nine.project.analyze.dto.req.GithubUserCountryReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserCountryRespDTO;
import com.nine.project.analyze.service.GithubUserCountryGuessService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;



/**
 * 用户所在国家/地区猜测服务接口实现层
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class GithubUserCountryGuessServiceImpl extends ServiceImpl<GithubUserCountryGuessMapper, GithubUserCountryGuessDO> implements GithubUserCountryGuessService {


    @Override
    public GithubUserCountryRespDTO getGithubUserCountryGuessByGithubUserId(String githubUserId) {
        LambdaQueryWrapper<GithubUserCountryGuessDO> queryWrapper = Wrappers.lambdaQuery(GithubUserCountryGuessDO.class)
                .eq(GithubUserCountryGuessDO::getGithubUserId, githubUserId)
                .eq(GithubUserCountryGuessDO::getDelFlag, 0);

        GithubUserCountryGuessDO githubUserCountryGuessDO = this.getOne(queryWrapper);

        return BeanUtil.copyProperties(githubUserCountryGuessDO, GithubUserCountryRespDTO.class);
    }

    @Override
    public void create(GithubUserCountryReqDTO requestParams) {
        GithubUserCountryGuessDO githubUserCountryGuessDTO = BeanUtil.copyProperties(requestParams, GithubUserCountryGuessDO.class);
        LambdaQueryWrapper<GithubUserCountryGuessDO> queryWrapper = Wrappers.lambdaQuery(GithubUserCountryGuessDO.class)
                .eq(GithubUserCountryGuessDO::getGithubUserId, requestParams.getGithubUserId())
                .eq(GithubUserCountryGuessDO::getDelFlag, 0);

        GithubUserCountryGuessDO githubUserCountryGuessDO = this.getOne(queryWrapper);
        // 如果存在，则更新。如果不存在，则添加
        if (githubUserCountryGuessDO != null) {
            LambdaQueryWrapper<GithubUserCountryGuessDO> updateWrapper = Wrappers.lambdaQuery(GithubUserCountryGuessDO.class)
                    .eq(GithubUserCountryGuessDO::getGithubUserId, requestParams.getGithubUserId())
                    .eq(GithubUserCountryGuessDO::getDelFlag, 0);

            this.update(githubUserCountryGuessDTO, updateWrapper);
        } else {
            this.save(githubUserCountryGuessDTO);
        }
    }
}
