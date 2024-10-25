import { gitReq } from './interceptor.server';
import { userSchema } from './schema/user';
import { user } from './typings/user';
import { githubUser } from './user';

export class githubUserServerOnly extends githubUser {
    async getUser(): Promise<user> {
        const res = await gitReq.get(`https://api.github.com/users/${this.name}`);
        const data = await userSchema.parseAsync(res.data);
        return data;
    }
}
