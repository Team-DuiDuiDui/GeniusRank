package com.nine.project.analyze.dao.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.nine.project.analyze.dao.entity.GithubUserScoreDO;
import com.nine.project.analyze.dto.resp.GithubUserScoreRankRespDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * GitHub 用户分数持久层
 */
public interface GithubUserScoreMapper extends BaseMapper<GithubUserScoreDO> {

    /**
     * 根据国家名称查询前几名用户（排行榜）
     */
    List<GithubUserScoreRankRespDTO> findTopScoresByCountryName(
            @Param("size")  Integer size,
            @Param("nations") List<String> nations);


    /**
     * 根据国家名称和开发者领域查询前几名用户（排行榜）
     */
    List<GithubUserScoreRankRespDTO> findTopScoresByCountryNameAndType(
            @Param("size")  Integer size,
            @Param("nations") List<String> nations,
            @Param("types") List<String> types);

    /**
     * 根据用户名查询排名
     * @param totalScore 分数
     * @return 排名
     */
    Integer getGithubUserRank(@Param("totalScore") Double totalScore);
}
