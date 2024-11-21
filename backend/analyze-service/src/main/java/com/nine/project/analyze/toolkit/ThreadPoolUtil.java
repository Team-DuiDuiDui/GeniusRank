package com.nine.project.analyze.toolkit;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.nine.project.analyze.dao.entity.GithubUserDeveloperDO;
import com.nine.project.analyze.dao.entity.GithubUserScoreDO;
import com.nine.project.analyze.dao.mapper.GithubUserDevelopMapper;
import com.nine.project.analyze.dao.mapper.GithubUserScoreMapper;
import com.nine.project.analyze.dto.req.GithubDetailedScoreReqDTO;
import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;
import com.nine.project.framework.exception.RemoteException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static com.nine.project.analyze.constant.RedisCacheConstant.USER_SCORE_EXPIRE_TIME;
import static com.nine.project.analyze.constant.RedisCacheConstant.USER_SCORE_KEY;
import static com.nine.project.framework.errorcode.BaseErrorCode.MESSAGE_QUEUE_ERROR;

@Slf4j
@Component
@RequiredArgsConstructor
public class ThreadPoolUtil {

    private final ThreadPoolTaskExecutor taskExecutor;
    private final GithubUserScoreMapper githubUserScoreMapper;
    private final GithubUserDevelopMapper githubUserDevelopMapper;
    private final CacheUtil<GithubUserScoreRespDTO> cacheUtil;

    /**
     * 异步执行普通用户分数和开发者领域计算任务
     * @param requestParams 请求参数
     * @param scores 分数
     */
    public void runCommonUserTaskAsync(GithubUserScoreReqDTO requestParams, GithubUserScoreRespDTO scores) {
        taskExecutor.execute(() -> {
            // 解析出开发者领域对象
            String login = requestParams.getUser().getLogin();

            // 持久化分数和开发者领域逻辑
            try {
                // 使用查询计数来判断记录是否存在
                LambdaQueryWrapper<GithubUserScoreDO> queryWrapper = Wrappers.lambdaQuery(GithubUserScoreDO.class)
                        .eq(GithubUserScoreDO::getLogin, login)
                        .eq(GithubUserScoreDO::getDelFlag, 0);
                long count = githubUserScoreMapper.selectCount(queryWrapper);
                boolean existsInDatabase = count > 0;

                // 封装持久化数据分数逻辑
                GithubUserScoreDO userScoreDO = BeanUtil.copyProperties(scores, GithubUserScoreDO.class);
                userScoreDO.setLogin(login);
                userScoreDO.setName(requestParams.getUser().getName());
                userScoreDO.setAvatarUrl(requestParams.getUser().getAvatar_url());
                saveOrUpdate(existsInDatabase, userScoreDO, queryWrapper, USER_SCORE_KEY + login);

                // 封装持久化数据开发者领域逻辑
                githubUserDevelopMapper.delete(Wrappers.lambdaQuery(GithubUserDeveloperDO.class).eq(GithubUserDeveloperDO::getLogin, login));

                List<String> topThreeLanguages = LanguageFrequencyCounter.getTopThreeLanguages(requestParams.getRepos());
                List<GithubUserDeveloperDO> developerDOList = new ArrayList<>();

                // 存入 Redis 中
                if (topThreeLanguages != null && !topThreeLanguages.isEmpty()) {
                    topThreeLanguages.forEach(cacheUtil::registerType);
                }

                for (String language : Objects.requireNonNull(topThreeLanguages)) {
                    GithubUserDeveloperDO developerDO = new GithubUserDeveloperDO();
                    developerDO.setLogin(login);
                    developerDO.setDeveloper_type(language);
                    developerDOList.add(developerDO);
                }

                // 使用 insertBatch 方法批量插入开发者领域数据
                if (!developerDOList.isEmpty()) {
                    githubUserDevelopMapper.insert(developerDOList);
                }
            } catch (Exception e) {
                throw new RemoteException("持久化分数和开发者领域失败", e, MESSAGE_QUEUE_ERROR);
            }

            log.info("异步持久化分数和开发者领域成功，用户名：{}", login);
        });
    }

    /**
     * 异步执行详细用户分数和开发者领域计算任务
     * @param requestParams 请求参数
     * @param scores 分数
     */
    public void runDetailedUserTaskAsync(GithubDetailedScoreReqDTO requestParams, GithubUserScoreRespDTO scores) {
        taskExecutor.execute(() -> {
            String login = requestParams.getLogin();

            // 持久化分数和开发者领域逻辑
            try {
                // 使用查询计数来判断记录是否存在
                LambdaQueryWrapper<GithubUserScoreDO> queryWrapper = Wrappers.lambdaQuery(GithubUserScoreDO.class)
                        .eq(GithubUserScoreDO::getLogin, login)
                        .eq(GithubUserScoreDO::getDelFlag, 0);
                long count = githubUserScoreMapper.selectCount(queryWrapper);
                boolean existsInDatabase = count > 0;

                // 封装持久化数据分数逻辑
                GithubUserScoreDO userScoreDO = BeanUtil.copyProperties(scores, GithubUserScoreDO.class);
                userScoreDO.setLogin(login);
                userScoreDO.setName(requestParams.getName());
                userScoreDO.setAvatarUrl(requestParams.getAvatarUrl());
                saveOrUpdate(existsInDatabase, userScoreDO, queryWrapper, USER_SCORE_KEY + login);

                // 封装持久化数据开发者领域逻辑
                githubUserDevelopMapper.delete(Wrappers.lambdaQuery(GithubUserDeveloperDO.class).eq(GithubUserDeveloperDO::getLogin, requestParams.getLogin()));

                List<GithubDetailedScoreReqDTO.Repository> repositoryList = Stream.concat(
                        requestParams.getRepositories().getNodes().stream(),
                        requestParams.getRepositoriesContributedTo().getNodes().stream()
                ).toList();

                List<String> topThreeLanguages = LanguageFrequencyCounter.getDetailedTopThreeLanguages(repositoryList);

                // 存入 Redis 中
                if (topThreeLanguages != null && !topThreeLanguages.isEmpty()) {
                    topThreeLanguages.forEach(cacheUtil::registerType);
                }

                List<GithubUserDeveloperDO> developerDOList = new ArrayList<>();

                for (String language : Objects.requireNonNull(topThreeLanguages)) {
                    GithubUserDeveloperDO developerDO = new GithubUserDeveloperDO();
                    developerDO.setLogin(requestParams.getLogin());
                    developerDO.setDeveloper_type(language);
                    developerDOList.add(developerDO);
                }

                // 使用 insertBatch 方法批量插入开发者领域数据
                if (!developerDOList.isEmpty()) {
                    githubUserDevelopMapper.insert(developerDOList);
                }
            } catch (Exception e) {
                throw new RemoteException("持久化分数和开发者领域失败", e, MESSAGE_QUEUE_ERROR);
            }

            log.info("异步持久化开发者领域成功，用户名：{}", login);
        });
    }

    /**
     * 根据是否存在数据库记录，决定是更新还是保存
     *
     * @param existsInDatabase 是否存在数据库记录
     * @param userScoreDO      持久化数据
     * @param queryWrapper     查询条件
     * @param cacheKey         缓存key
     */
    private void saveOrUpdate(boolean existsInDatabase, GithubUserScoreDO userScoreDO, LambdaQueryWrapper<GithubUserScoreDO> queryWrapper, String cacheKey) {
        if (existsInDatabase) {
            githubUserScoreMapper.update(userScoreDO, queryWrapper);
        } else{
            cacheUtil.addTotalScoredUser();  // 更新用户总数
            githubUserScoreMapper.insert(userScoreDO);
        }

        // 封装响应数据
        GithubUserScoreRespDTO respDTO = BeanUtil.copyProperties(userScoreDO, GithubUserScoreRespDTO.class);
        respDTO.setUpdateTime(Instant.now().getEpochSecond());
        respDTO.setName(userScoreDO.getName());
        respDTO.setAvatarUrl(userScoreDO.getAvatarUrl());

        // 存入缓存
        cacheUtil.send2CacheHash(cacheKey, respDTO, USER_SCORE_EXPIRE_TIME, TimeUnit.SECONDS);
    }
}
