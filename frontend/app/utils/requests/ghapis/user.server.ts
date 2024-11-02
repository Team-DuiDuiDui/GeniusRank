import { userSchema } from './schema/user';
import { User } from './typings/user';
import { githubUser as GithubUser } from './user';
import axios, { AxiosInstance } from 'axios';
import { handleServerReq } from '../request';
import { createInstanceForGithub } from '../instance';

/**
 * GithubUserServerOnly 类继承自 GithubUser 类，专门用于服务器端操作。
 * 该类使用服务器端的 GitHub 访问令牌进行 API 请求。
 */
export class GithubUserServerOnly extends GithubUser {
    private token: string;
    private axiosInstanceWithServerToken: AxiosInstance;

    /**
     * 构造函数，初始化 GithubUserServerOnly 实例。
     *
     * @param name GitHub 用户名
     * @param token GITHUB_ACCESS_TOKEN
     */
    constructor(name: string, token: string) {
        super(name, undefined, undefined, true);
        this.token = token;
        this.axiosInstanceWithServerToken = createInstanceForGithub(token, 'Team-Duiduidui: Genius Rank');
    }

    /**
     * 获取 GitHub 用户信息。
     *
     * @returns 返回包含用户信息的 Promise 对象，如果请求失败则返回 undefined。
     */
    async getUser(): Promise<User | undefined> {
        return await handleServerReq<User>(
            () => this.axiosInstanceWithServerToken.get(`/users/${this.name}`),
            (res) => userSchema.parseAsync(res.data),
            (error) => {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        return false;
                    }
                    return true;
                }
            }
        );
    }
}
