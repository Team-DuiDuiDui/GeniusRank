export type UserDetail = {
    id: string;
    avatarUrl: string;
    name: string | null;
    databaseId: number | null;
    login: string;
    bio: string | null;
    followers: {
        totalCount: number;
    };
    following: {
        totalCount: number;
    };
    location: string | null;
    company: string | null;
    twitterUsername: string | null;
    lifetimeReceivedSponsorshipValues: {
        totalCount: number;
    };
    pullRequests: {
        nodes: PullRequestDetail[] | [] | null[];
        totalCount: number;
    };
    issues: {
        nodes: IssueDetail[] | [] | null[];
        totalCount: number;
    };
    repositories: {
        nodes: RepositoryDetail[] | [] | null[];
        totalCount: number;
    };
    repositoriesContributedTo: {
        nodes: RepositoryDetail[] | [] | null[];
        totalCount: number;
    };
};

export type PullRequestDetail = {
    title: string;
    url: string;
    state: 'CLOSED' | 'MERGED' | 'OPEN';
    number: number;
    baseRepository: RepositoryDetail | null;
    commits: {
        totalCount: number;
    };
    totalCommentsCount: number | null;
    updatedAt: string;
};

export type IssueDetail = {
    title: string;
    url: string;
    state: 'CLOSED' | 'OPEN';
    number: number;
    //这里确实没有 null
    repository: RepositoryDetail;
    comments: {
        totalCount: number;
    };
    updatedAt: string;
};

export type RepositoryDetail = {
    url: string;
    isFork: boolean;
    stargazerCount: number;
    forkCount: number;
    issues: {
        totalCount: number;
    } | null;
    pullRequests: {
        totalCount: number;
    } | null;
    discussions: {
        totalCount: number;
    } | null;
    primaryLanguage: {
        name: string;
    } | null;
    watchers: {
        totalCount: number;
    };
};

export type UserData = {
    data: {
        user: UserDetail;
    };
};

type Location = {
    line: number;
    column: number;
};

type Error = {
    type: string;
    path: string[];
    locations: Location[];
    message: string;
};

type Data = {
    user: null | User; // 如果 user 可能有具体内容，可以定义 User 类型
};

export type ERRORResponseDetail = {
    data: Data;
    errors: Error[];
};
