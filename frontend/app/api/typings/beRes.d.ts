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
    data: ScoreRankResp[];
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
    name: string | null;
    avatar_url: string;
    /**
     * 国家 iso 编码
     */
    country_iso: null | string;
    /**
     * 国家名字
     */
    country_name: null | string;
    /**
     * issue 分数
     */
    issuesScore: number | number;
    /**
     * Github 用户名
     */
    login: string;
    /**
     * pr 分数
     */
    prsScore: number | number;
    /**
     * 仓库分数
     */
    reposScore: number | number;
    /**
     * 总分数
     */
    totalScore: number;
    /**
     * 用户基础分数
     */
    userScore: number;
};
