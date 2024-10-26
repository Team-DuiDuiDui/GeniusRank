/* eslint-disable import/no-named-as-default-member */
import axios, { AxiosInstance } from 'axios';
import { IssueSearchResult } from './typings/user';
import { issueSearchResultSchema } from './schema/user';
import { userIssuesEX, userPRsEX } from '~/utils/EXAMPLES';

export class githubUser {
    public name: string;
    private axiosInstance: AxiosInstance = axios.create({
        baseURL: 'https://api.github.com',
    });
    constructor(name: string) {
        this.name = name;
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
