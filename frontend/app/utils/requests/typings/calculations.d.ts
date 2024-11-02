export type calculationsReq = {
    user: {
        login: string;
        followers: number;
        public_repos: number;
        commit_amount: number;
        pr_amount: number;
        issue_amount: number;
    };
    repos: {
        forked: boolean;
        stars?: number;
        forks?: number;
        watchers?: number;
        open_issues?: number;
        language?: string | null;
    }[];
    prs: {
        pr_and_issue_amount: number;
    }[];
    issues: {
        pr_and_issue_amount: number;
    }[];
};
