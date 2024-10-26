/* eslint-disable import/no-named-as-default-member */
import axios, { AxiosInstance } from 'axios';
import { IssueSearchResult, UserAsFollowerArray } from './typings/user';
import { issueSearchResultSchema, userAsFollowerArraySchema } from './schema/user';
import { handleServerReq } from '../request';

export class githubUser {
    public name: string;
    private axiosInstance: AxiosInstance = axios.create({
        baseURL: 'https://api.github.com',
    });
    private isAuthorized: boolean = false;

    constructor(name: string, token?: string) {
        this.name = name;
        this.axiosInstance = axios.create({
            baseURL: 'https://api.github.com',
            headers: token ? {
                Authorization: `token ${token}`,
            } : {},
        });
        this.isAuthorized = true;
    }

    async getUserPrs(): Promise<IssueSearchResult> {
        const res = await this.axiosInstance.get(
            `/search/issues?q=type:pr+is:merged+author:${this.name}+state:closed&sort=updated&per_page=50`
        );
        const data = await issueSearchResultSchema.parseAsync(res.data);
        return data;
    }

    async getUserIssues(): Promise<IssueSearchResult> {
        const res = await this.axiosInstance.get(
            `/search/issues?q=type:issue+author:${this.name}&sort=updated&per_page=50`
        );
        const data = await issueSearchResultSchema.parseAsync(res.data);
        return data;
    }
}
