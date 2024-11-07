package com.nine.project.analyze.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 用户排名响应 DTO
 */
@Data
@AllArgsConstructor
public class UserRankRespDTO {

    private Integer rank;

    private Double score;
}
