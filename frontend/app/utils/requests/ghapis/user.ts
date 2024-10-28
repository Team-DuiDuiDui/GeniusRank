/* eslint-disable import/no-named-as-default-member */
import { AxiosInstance } from 'axios';
import { CommitsSearchResult, IssueSearchResult, User, UserRepos } from './typings/user';
import { commitsSearchResultSchema, issueSearchResultSchema, userReposSchema } from './schema/user';
import { createInstanceForGithub } from '../instance';
import { handleClientGithubReq } from '../request';

export class githubUser {
    public name: string;
    private axiosInstance: AxiosInstance = createInstanceForGithub();
    private isAuthorized: boolean = false;
    public userData: User | null = null;
    public userRepos: UserRepos | null = null;
    public userPrs: IssueSearchResult | null = null;
    public userIssues: IssueSearchResult | null = null;

    constructor(name: string, token?: string, userData?: User) {
        this.name = name;
        this.axiosInstance = createInstanceForGithub(token);
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
            async res => issueSearchResultSchema.parseAsync(res.data)
        ))!;
        this.userPrs = data;
        return data;
    }

    async getUserIssues(): Promise<IssueSearchResult> {
        const data = (await handleClientGithubReq<IssueSearchResult>(
            () =>
                this.axiosInstance.get(
                    `/search/issues?q=type:issue+author:${this.name}&sort=updated&per_page=80`
                ),
            async res => issueSearchResultSchema.parseAsync(res.data)
        ))!;
        this.userIssues = data;
        return data;
    }
    
    async getUserRepos(): Promise<UserRepos> {
        const data = (await handleClientGithubReq<UserRepos>(
            () =>
                this.axiosInstance.get(
                    `/users/${this.name}/repos?sort=updated&per_page=80`
                ),
            async res => userReposSchema.parseAsync(res.data)
        ))!;
        this.userRepos = data;
        return data;
    }

    async getUserCommits(): Promise<CommitsSearchResult> {
        const data = (await handleClientGithubReq<CommitsSearchResult>(
            () =>
                this.axiosInstance.get(
                    `/search/commits?q=author:${this.name}&sort=author-date&per_page=80`
                ),
            async res => commitsSearchResultSchema.parseAsync(res.data)
        ))!;
        return data;
    }
}
