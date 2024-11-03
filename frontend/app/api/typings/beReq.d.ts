/**
 * GithubScoreReq
 */
export type GithubScoreReqUnLogin = {
    /**
     * issue
     */
    issues?: {
        /**
         * 数量
         */
        pr_and_issue_amount: number;
    }[];
    /**
     * pull request
     */
    prs?: {
        /**
         * 数量
         */
        pr_and_issue_amount: number;
    }[];
    /**
     * Github 用户仓库信息
     */
    repos?: {
        /**
         * 是否为 forked
         */
        forked: boolean;
        /**
         * forks 数量
         */
        forks: number;
        /**
         * 仓库主语言
         */
        language?: string | null;
        /**
         * open_issues 数量
         */
        open_issues: number;
        /**
         * star 数量
         */
        stars: number;
        /**
         * watchers 数量
         */
        watchers: number;
    }[];
    /**
     * GitHub 用户数据
     */
    user: {
        /**
         * commit 数量
         */
        commit_amount: number;
        /**
         * 被关注的人数
         */
        followers: number;
        /**
         * issue 数量
         */
        issue_amount: number;
        /**
         * pr 数量
         */
        pr_amount: number;
        /**
         * 公开的仓库数量
         */
        public_repos: number;
        /**
         * 用户名
         */
        login: string;
    };
};

/**
 * DetailedUserScoreReq
 */
export type GithubScoreReqLogin = {
    /**
     * 被关注的人数
     */
    followers?: TotalCountOnly;
    /**
     * issues
     */
    issues?: {
        /**
         * 节点
         */
        nodes?: {
            repository: Repository;
        }[];
        /**
         * 数量
         */
        totalCount?: number;
    };
    /**
     * 捐赠者
     */
    lifetimeReceivedSponsorshipValues?: TotalCountOnly;
    /**
     * 用户名
     */
    login?: string;
    /**
     * prs
     */
    pullRequests?: {
        /**
         * 节点
         */
        nodes?: {
            /**
             * 对应仓库信息
             */
            baseRepository?: BaseRepository;
            commits?: Commits;
            /**
             * 状态（'CLOSED' | 'MERGED' | 'OPEN'）
             */
            state?: string;
        }[];
        /**
         * 数量
         */
        totalCount?: number;
    };
    /**
     * 用户仓库信息
     */
    repositories?: Repositories;
    /**
     * 其他仓库信息
     */
    repositoriesContributedTo?: Repositories;
};
/**
 * Repository
 */
type Repository = {
    /**
     * fork 数
     */
    forkCount?: number;
    issues?: TotalCountOnly;
    /**
     * 主语言
     */
    primaryLanguage?: NodePrimaryLanguage;
    /**
     * pr 数
     */
    pullRequests?: TotalCountOnly;
    /**
     * star 数
     */
    stargazerCount?: number;
    /**
     * watch数
     */
    watchers?: TotalCountOnly;
};
