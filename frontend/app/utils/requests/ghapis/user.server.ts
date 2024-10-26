import { userAsFollowerArraySchema, userSchema } from './schema/user';
import { User, UserAsFollowerArray } from './typings/user';
import { githubUser as GithubUser } from './user';
import axios, { AxiosInstance } from 'axios';
import { handleGithubReq } from '../request';

export class GithubUserServerOnly extends GithubUser {
    private token: string;
    private axiosInstanceWithToken: AxiosInstance;

    constructor(name: string, token: string) {
        super(name);
        this.token = token;
        this.axiosInstanceWithToken = axios.create({
            baseURL: 'https://api.github.com',
            headers: {
                'User-Agent': 'Team-Duiduidui: Genius Rank',
            },
        });
    }

    async getUser(): Promise<User | undefined> {
        return await handleGithubReq<User, any>(
            () =>
                this.axiosInstanceWithToken.get(`/users/${this.name}`, {
                    headers: { Authorization: `token ${this.token}` },
                }),
            (res) => userSchema.parseAsync(res.data)
        );
    }

    async getFollowers(): Promise<UserAsFollowerArray | undefined> {
        return await handleGithubReq<UserAsFollowerArray, any>(
            () => this.axiosInstanceWithToken.get(`/users/${this.name}/followers`),
            (res) => userAsFollowerArraySchema.parseAsync(res.data)
        );
    }
}
