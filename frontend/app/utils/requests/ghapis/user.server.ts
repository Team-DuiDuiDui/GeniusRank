import { userEX } from '~/utils/EXAMPLES';
import { gitReq } from './interceptor.server';
import { userSchema } from './schema/user';
import { User } from './typings/user';
import { githubUser as GithubUser } from './user';

export class GithubUserServerOnly extends GithubUser {
    async getUser(): Promise<User> {
        const res = await gitReq.get(`https://api.github.com/users/${this.name}`);
        const data = await userSchema.parseAsync(res.data);
        return data;
        return userEX;
    }
}
