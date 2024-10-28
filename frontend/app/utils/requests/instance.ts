import axios, { AxiosInstance } from 'axios';
import sleep from '../sleep';

/**
 * 创建一个可重试的 Axios 实例。
 * 
 * 该实例在请求失败时会自动重试，最多重试 3 次。每次重试之间会有一个指数级增长的延迟。
 * 
 * @returns 可重试的 Axios 实例
 */
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

// TODO: 对接 handleRequest ，做一个再恰当时机的重试
/**
 * 创建一个用于 GitHub API 的 Axios 实例。
 * 
 * 该实例会自动添加 GitHub API 的 baseURL 和可选的授权头。
 * 
 * @param token - 可选的 GitHub 访问令牌
 * @returns 用于 GitHub API 的 Axios 实例
 */
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
        console.log(err.response?.data.message);
        if (config._retries++ >= retry) return Promise.reject(err);
        await sleep((Math.pow(3.8, config._retries) / 2 - 1 / 2) * 1000);
        return interceptor(config);
    });
    return interceptor;
};
