import { userEX } from '~/utils/EXAMPLES';
import { userSchema } from './schema/user';
import { User } from './typings/user';
import { githubUser as GithubUser } from './user';
import axios, { AxiosInstance } from 'axios';

export class GithubUserServerOnly extends GithubUser {
    private token: string;
    private axiosInstance: AxiosInstance
    constructor(name: string, token: string) {
        super(name);
        this.token = token;
        this.axiosInstance = axios.create({
            baseURL: 'https://api.github.com',
            headers: {
                Authorization: `token ${this.token}`,
            }
        })
    }
    async getUser(): Promise<User> {
        const res = await this.axiosInstance.get(`/users/${this.name}`);
        const data = await userSchema.parseAsync(res.data);
        return data;
        return userEX;
    }

    async getFollowers(): Promise<User[]> {
        const res = await this.axiosInstance.get(`/users/${this.name}/followers`);
        const data = await userSchema.array().parseAsync(res.data);
        return data;
    }
}
