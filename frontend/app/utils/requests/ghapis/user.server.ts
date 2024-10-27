import { userSchema } from './schema/user';
import { User } from './typings/user';
import { githubUser as GithubUser } from './user';
import { AxiosInstance } from 'axios';
import { handleServerReq } from '../request';
import { createInstanceForGithub } from '../instance';

export class GithubUserServerOnly extends GithubUser {
    private token: string;
    private axiosInstanceWithServerToken: AxiosInstance;

    constructor(name: string, token: string) {
        super(name);
        this.token = token;
        this.axiosInstanceWithServerToken = createInstanceForGithub(token);
    }

    async getUser(): Promise<User | undefined> {
        return await handleServerReq<User, { data: unknown }>(
            () => this.axiosInstanceWithServerToken.get(`/users/${this.name}`),
            (res) => userSchema.parseAsync(res.data)
        );
    }
}
