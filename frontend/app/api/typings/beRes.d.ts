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
