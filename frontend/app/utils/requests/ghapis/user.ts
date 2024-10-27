/* eslint-disable import/no-named-as-default-member */
import { AxiosInstance } from 'axios';
import { IssueSearchResult, User, UserRepos } from './typings/user';
import { issueSearchResultSchema, userReposSchema } from './schema/user';
import { createInstanceForGithub } from '../instance';

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
        const res = await this.axiosInstance.get(
            `/search/issues?q=type:pr+is:merged+author:${this.name}+state:closed&sort=updated&per_page=80`
        );
        const data = await issueSearchResultSchema.parseAsync(res.data);
        this.userPrs = data;
        return data;
    }

    async getUserIssues(): Promise<IssueSearchResult> {
        const res = await this.axiosInstance.get(
            `/search/issues?q=type:issue+author:${this.name}&sort=updated&per_page=80`
        );
        const data = await issueSearchResultSchema.parseAsync(res.data);
        this.userIssues = data;
        return data;
    }
    async getUserRepos(): Promise<UserRepos> {
        const res = await this.axiosInstance.get(`/users/${this.name}/repos?sort=updated&per_page=80`);
        const data = await userReposSchema.parseAsync(res.data);
        this.userRepos = data;
        return data;
    }
}
