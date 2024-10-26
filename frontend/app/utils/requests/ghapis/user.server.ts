import { userSchema } from './schema/user';
import { User } from './typings/user';
import { githubUser as GithubUser } from './user';
import axios, { AxiosInstance } from 'axios';
import { handleServerReq } from '../request';

export class GithubUserServerOnly extends GithubUser {
    private token: string;
    private axiosInstanceWithServerToken: AxiosInstance

    constructor(name: string, token: string) {
        super(name);
        this.token = token;
        this.axiosInstanceWithServerToken = axios.create({
            baseURL: 'https://api.github.com',
            headers: {
                Authorization: `token ${this.token}`,
                'User-Agent': 'Team-Duiduidui: Genius Rank',
            },
        });
    }

    async getUser(): Promise<User | undefined> {
        return await handleServerReq<User, { data: unknown }>(
            () => this.axiosInstanceWithServerToken.get(`/users/${this.name}`),
            (res) => userSchema.parseAsync(res.data))
    }


}
