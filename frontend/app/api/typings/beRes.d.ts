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
