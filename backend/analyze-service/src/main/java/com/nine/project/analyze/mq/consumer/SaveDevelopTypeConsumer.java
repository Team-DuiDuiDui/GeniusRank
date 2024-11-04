package com.nine.project.analyze.mq.consumer;

import cn.hutool.core.bean.BeanUtil;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.nine.project.analyze.constant.RocketMQConstant;
import com.nine.project.analyze.dao.entity.GithubUserDeveloperDO;
import com.nine.project.analyze.dao.entity.GithubUserScoreDO;
import com.nine.project.analyze.dao.mapper.GithubUserDevelopMapper;
import com.nine.project.analyze.dao.mapper.GithubUserScoreMapper;
import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRespDTO;
import com.nine.project.analyze.mq.event.GeneralMessageEvent;
import com.nine.project.analyze.mq.event.SaveScoreAndTypeEvent;
import com.nine.project.analyze.toolkit.CacheUtil;
import com.nine.project.analyze.toolkit.LanguageFrequencyCounter;
import com.nine.project.framework.exception.RemoteException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

import static com.nine.project.analyze.constant.RedisCacheConstant.USER_SCORE_EXPIRE_TIME;
import static com.nine.project.analyze.constant.RedisCacheConstant.USER_SCORE_KEY;
import static com.nine.project.framework.errorcode.BaseErrorCode.MESSAGE_QUEUE_ERROR;

/**
 * 持久化分数和开发者领域消费者
 */
@Slf4j
@Component
@RequiredArgsConstructor
@RocketMQMessageListener(
        topic = RocketMQConstant.TOPIC_KEY,
        selectorExpression = RocketMQConstant.DETAILED_TYPE_TAG,
        consumerGroup = RocketMQConstant.CONSUMER_TYPE_GROUP
)
public class SaveDevelopTypeConsumer implements RocketMQListener<GeneralMessageEvent> {

    private final GithubUserScoreMapper githubUserScoreMapper;
    private final GithubUserDevelopMapper githubUserDevelopMapper;
    private final CacheUtil<GithubUserScoreRespDTO> cacheUtil;

    @Override
    public void onMessage(GeneralMessageEvent message) {
        String jsonBody = message.getBody();
        SaveScoreAndTypeEvent saveScoreAndTypeEvent;

        // 尝试解析 JSON
        try {
            saveScoreAndTypeEvent = JSON.to(SaveScoreAndTypeEvent.class, jsonBody);
        } catch (JSONException e) {
            log.error("出现恶意请求，消息队列解析失败，消息内容：{}", jsonBody);
            return;
        }

        // 解析出开发者领域对象
        GithubUserScoreReqDTO requestParams = saveScoreAndTypeEvent.getRequestParams();
        GithubUserScoreRespDTO scores = saveScoreAndTypeEvent.getScores();
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
            saveOrUpdate(existsInDatabase, userScoreDO, queryWrapper, USER_SCORE_KEY + login);

            // 封装持久化数据开发者领域逻辑
            githubUserDevelopMapper.delete(Wrappers.lambdaQuery(GithubUserDeveloperDO.class).eq(GithubUserDeveloperDO::getLogin, login));

            List<String> topThreeLanguages = LanguageFrequencyCounter.getTopThreeLanguages(requestParams.getRepos());
            List<GithubUserDeveloperDO> developerDOList = new ArrayList<>();

            for (String language : topThreeLanguages) {
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

        log.info("异步持久化开发者领域成功，用户名：{}", login);
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
            githubUserScoreMapper.insert(userScoreDO);
        }

        // 封装响应数据
        GithubUserScoreRespDTO respDTO = BeanUtil.copyProperties(userScoreDO, GithubUserScoreRespDTO.class);
        respDTO.setUpdateTime(Instant.now().getEpochSecond());

        // 存入缓存
        cacheUtil.send2CacheHash(cacheKey, respDTO, USER_SCORE_EXPIRE_TIME, TimeUnit.SECONDS);
    }
}
