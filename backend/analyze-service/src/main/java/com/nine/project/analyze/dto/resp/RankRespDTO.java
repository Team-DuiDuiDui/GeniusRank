package com.nine.project.analyze.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

/**
 * 排名
 */
@Data
@AllArgsConstructor
public class RankRespDTO {
    /**
     * 返回数据
     */
    private List<GithubUserScoreRankRespDTO> resp;

    /**
     * 全部的国家
     */
    private List<String> nations;

    /**
     * 全部的语言
     */
    private List<String> types;

    /**
     * 总数
     */
    private Integer totalCount;
}
