/* eslint-disable import/no-named-as-default-member */
import axios from 'axios';
import { userSchema } from './schema/user';
import { user } from './typings/user';
import { gitReq } from './interceptor.server';

export class githubUser {
    public name: string;
    constructor(name: string) {
        this.name = name;
    }
    async getUser(): Promise<user> {
        const res = await gitReq.get(`https://api.github.com/users/${this.name}`);
        const data = await userSchema.parseAsync(res.data);
        return data;
    }
}
