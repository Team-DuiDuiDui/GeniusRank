type GithubScoreRes = {
    code: string;
    message: string | null;
    data: {
        totalScore: number;
        userScore: number;
        reposScore: number;
        prsScore: number;
        issuesScore: number;
        updateTime: number;
    };
    success: boolean;
};

export type OAuthLogin = {
    /**
     * 错误码
     */
    code: string;
    /**
     * 成功时返回的数据
     */
    data: {
        /**
         * 登录凭证，UUID，服务端采用redis存储token
         */
        token: string;
    };
    /**
     * 错误码信息
     */
    message: null;
    /**
     * 请求是否成功
     */
    success: boolean;
};
export type UserScoreRanking = {
    /**
     * 错误码
     */
    code: string;
    data: ScoreRankResp;
    /**
     * 错误码信息
     */
    message: null;
    /**
     * 请求是否成功
     */
    success: boolean;
};

/**
 * ScoreRankResp
 */
export type ScoreRankResp = {
    nations: string[];
    resp: RankResp[];
    types: string[];
};

export type RankResp = {
    avatar_url: string;
    country_iso?: string;
    issuesScore: number;
    login: string;
    name: string;
    prsScore: number;
    reposScore: number;
    totalScore: number;
    userScore: number;
};

export type SingleUserScoreRes = {
    /**
     * 错误码
     */
    code: string;
    data: GithubScoreResp;
    /**
     * 错误码信息
     */
    message: null;
    /**
     * 请求是否成功
     */
    success: boolean;
};

/**
 * GithubScoreResp
 */
export type GithubScoreResp = {
    name: string | null;
    avatar_url: string;
    /**
     * 用户 issues 数据得分
     */
    issuesScore: number;
    /**
     * 用户 prs 数据得分
     */
    prsScore: number;
    /**
     * 用户仓库数据得分
     */
    reposScore: number;
    /**
     * 用户总得分
     */
    totalScore: number;
    /**
     * 更新时间时间戳
     */
    updateTime: number;
    /**
     * 用户基础数据得分
     */
    userScore: number;
};
