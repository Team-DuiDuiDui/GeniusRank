/* eslint-disable import/no-named-as-default-member */
import axios from 'axios';
import { IssueSearchResult } from './typings/user';
import { issueSearchResultSchema } from './schema/user';

export class githubUser {
    public name: string;
    constructor(name: string) {
        this.name = name;
    }

    async getUserPrs(): Promise<IssueSearchResult> {
        const res = await axios.get(
            `https://api.github.com/search/issues?q=type:pr+is:merged+author:${this.name}+state:closed&sort=updated&per_page=50`
        );
        console.log(res);
        const data = await issueSearchResultSchema.parseAsync(res.data);
        return data;
    }
}
