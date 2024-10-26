import axios from "axios";

export const createInstanceForGithub = (token?: string) => {
    return axios.create({
        baseURL: 'https://api.github.com',
        headers: token ? {
            Authorization: `token ${token}`,
            'User-Agent': 'Team-Duiduidui: Genius Rank',
        } : {},
    });
}