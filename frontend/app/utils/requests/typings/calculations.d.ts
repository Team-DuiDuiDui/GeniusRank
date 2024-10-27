export type calculationsReq = {
    user: {
        followers: number;
        public_repos: number;
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
