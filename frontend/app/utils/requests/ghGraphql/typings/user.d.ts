type User = {
    avatarUrl: string;
    name: string | null;
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
        nodes: PullRequest[] | [] | null[];
        totalCount: number;
    };
    issues: {
        nodes: Issue[] | [] | null[];
        totalCount: number;
    };
    repositories: {
        nodes: Repository[] | [] | null[];
        totalCount: number;
    };
    repositoriesContributedTo: {
        nodes: Repository[] | [] | null[];
        totalCount: number;
    };
};

type PullRequest = {
    title: string;
    url: string;
    state: 'CLOSED' | 'MERGED' | 'OPEN';
    number: number;
    baseRepository: Repository | null;
    commits: {
        totalCount: number;
    };
    totalCommentsCount: number | null;
    createdAt: string;
};

type Issue = {
    title: string;
    url: string;
    state: 'CLOSED' | 'OPEN';
    number: number;
    //这里确实没有 null
    repository: Repository;
    comments: {
        totalCount: number;
    };
    createdAt: string;
};

type Repository = {
    url: string;
    isFork: boolean;
    stargazerCount: number;
    forkCount: number;
    issues: {
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
        user: User;
    };
};
