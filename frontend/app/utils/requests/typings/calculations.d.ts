export type calculationsReq = {
    user: {
        id: number;
        name: string;
        followers: number;
        public_repos: number;
        commit_amount: number;
        pr_amount: number;
        issue_amount: number;
        repo_amount: number;
        type: 'User' | 'Organization';
    };
    repos: {
        name: string;
        is_forked: boolean;
        stars?: number;
        forks?: number;
        watchers?: number;
        open_issues?: number;
        language?: string | null;
        size?: number;
    }[];
    prs: {
        repo_url: string;
        pr_and_issue_amount: number;
    }[];
    issues: {
        repo_url: string;
        pr_and_issue_amount: number;
    }[];
};
