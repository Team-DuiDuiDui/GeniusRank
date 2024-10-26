import { userEX } from '~/utils/EXAMPLES';
import { userSchema } from './schema/user';
import { User } from './typings/user';
import { githubUser as GithubUser } from './user';
import axios from 'axios';

export class GithubUserServerOnly extends GithubUser {
    private token: string;
    constructor(name: string, token: string) {
        super(name);
        this.token = token;
    }
    async getUser(): Promise<User> {
        const res = await axios.get(`https://api.github.com/users/${this.name}`, {
            headers: {
                Authorization: `token ${this.token}`,
            },
        });
        const data = await userSchema.parseAsync(res.data);
        return data;
        return userEX;
    }
}
