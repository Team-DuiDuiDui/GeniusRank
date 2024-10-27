import axios, { AxiosInstance } from 'axios';
import sleep from '../sleep';

export const axiosRetriable = (): AxiosInstance => {
    const interceptor = axios.create();
    interceptor.interceptors.response.use(null, async (err) => {
        const { config } = err;
        const { retry = 3 } = config;
        config._retries = config._retries || 0;
        if (config._retries++ >= retry) return Promise.reject(err);
        await sleep((Math.pow(2, config._retries) - 1 / 2) * 1000);
        return interceptor(config);
    });
    return interceptor;
};

export const createInstanceForGithub = (token?: string): AxiosInstance => {
    const interceptor = axios.create({
        baseURL: 'https://api.github.com',
        headers: token
            ? {
                  Authorization: `token ${token}`,
                  'User-Agent': 'Team-Duiduidui: Genius Rank',
              }
            : {},
    });
    interceptor.interceptors.response.use(null, async (err) => {
        const { config } = err;
        const { retry = 3 } = config;
        config._retries = config._retries || 0;
        if (config._retries++ >= retry) return Promise.reject(err);
        await sleep((Math.pow(2, config._retries) - 1 / 2) * 1000);
        return interceptor(config);
    });
    return interceptor;
};
