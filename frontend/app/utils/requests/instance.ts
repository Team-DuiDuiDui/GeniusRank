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

// 防止 baseurl 在不同实例上不同，造成请求失败
export interface AxiosInstanceForGithub extends AxiosInstance {}

export const createInstanceForGithub = (token?: string): AxiosInstanceForGithub => {
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
        await sleep((Math.pow(3.8, config._retries) / 2 - 1 / 2) * 1000);
        return interceptor(config);
    });
    return interceptor;
};
