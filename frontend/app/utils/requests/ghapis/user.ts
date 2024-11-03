/* eslint-disable import/no-named-as-default-member */
import { AxiosInstance } from 'axios';
import { CommitsSearchResult, IssueSearchResult, User, UserRepos } from './typings/user';
import { commitsSearchResultSchema, issueSearchResultSchema, userReposSchema } from './schema/user';
import { handleClientGithubReq, handleClientReq } from '../request';
import { createInstanceForGithub } from '../instance';
import { createInstanceForBe } from '~/api/instance';
import { GithubScoreReqUnLogin } from '../typings/beReq';

export class githubUser {
    public name: string;
    private axiosInstance: AxiosInstance;
    private beInstance: AxiosInstance;
    private isAuthorized: boolean = false;
    public userData: User | null = null;
    public userRepos: UserRepos | null = null;
    public userPrs: IssueSearchResult | null = null;
    public userIssues: IssueSearchResult | null = null;
    public userCommits: CommitsSearchResult | null = null;

    constructor(
        name: string,
        token?: string,
        userData?: User,
        axiosInstance?: AxiosInstance,
        beInstance?: AxiosInstance
    ) {
        this.name = name;
        this.axiosInstance = axiosInstance ? axiosInstance : createInstanceForGithub(token);
        this.beInstance = beInstance ? beInstance : createInstanceForBe();
        this.userData = userData ?? null;
        if (token) this.isAuthorized = true;
    }

    setUserName(name: string) {
        this.name = name;
    }

    setUserData(userData: User) {
        this.userData = userData;
    }

    async getUserPrs(): Promise<IssueSearchResult> {
        const data = (await handleClientGithubReq<IssueSearchResult>(
            () =>
                this.axiosInstance.get(
                    `/search/issues?q=type:pr+is:merged+author:${this.name}+state:closed&sort=updated&per_page=80`
                ),
            (res) => issueSearchResultSchema.parseAsync(res.data)
        ))!;
        this.userPrs = data;
        return data;
    }

    async getUserIssues(): Promise<IssueSearchResult> {
        const data = (await handleClientGithubReq<IssueSearchResult>(
            () => this.axiosInstance.get(`/search/issues?q=type:issue+author:${this.name}&sort=updated&per_page=80`),
            (res) => issueSearchResultSchema.parseAsync(res.data)
        ))!;
        this.userIssues = data;
        return data;
    }

    async getUserRepos(): Promise<UserRepos> {
        const data = (await handleClientGithubReq<UserRepos>(
            () => this.axiosInstance.get(`/users/${this.name}/repos?sort=updated&per_page=80`),
            (res) => userReposSchema.parseAsync(res.data)
        ))!;
        this.userRepos = data;
        return data;
    }

    async getUserCommits(): Promise<CommitsSearchResult> {
        const data = (await handleClientGithubReq<CommitsSearchResult>(
            () => this.axiosInstance.get(`/search/commits?q=author:${this.name}&sort=author-date&per_page=80`),
            (res) => commitsSearchResultSchema.parseAsync(res.data)
        ))!;
        this.userCommits = data;
        return data;
    }

    async getUserScores(): Promise<GithubScoreRes> {
        const req: GithubScoreReqUnLogin = {
            repos: this.userRepos?.map((repo) => {
                return {
                    forked: repo.fork,
                    forks: repo.forks_count ?? 0,
                    language: repo.language,
                    open_issues: repo.open_issues_count ?? 0,
                    stars: repo.stargazers_count ?? 0,
                    watchers: repo.watchers_count ?? 0,
                };
            }),
            issues: this.userIssues?.items?.map((issue) => {
                return { pr_and_issue_amount: issue.number };
            }),
            prs: this.userPrs?.items?.map((pr) => {
                return { pr_and_issue_amount: pr.number };
            }),
            user: {
                login: this.name,
                commit_amount: this.userCommits?.total_count ?? 0,
                followers: this.userData?.followers ?? 0,
                issue_amount: this.userIssues?.total_count ?? 0,
                pr_amount: this.userPrs?.total_count ?? 0,
                public_repos: this.userData?.public_repos ?? 0,
            },
        };
        const data = (await handleClientReq<GithubScoreRes>(
            () =>
                this.beInstance.post(`/analyze/score/detailed`, {
                    ...req,
                }),
            (res) => res.data
        ))!;
        return data;
    }

    isFulfilled(): boolean {
        return !!this.userData && !!this.userPrs && !!this.userRepos && !!this.userPrs && !!this.userCommits;
    }
}
