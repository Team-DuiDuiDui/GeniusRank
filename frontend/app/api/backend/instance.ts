import axios, { AxiosInstance } from 'axios';

export interface AxiosInstanceForBe extends AxiosInstance { }

export interface AxiosInstanceForDeepSeek extends AxiosInstance { }

/**
 * 创建后端 axios 实例
 * @param token 用户用来与后端接口通信的 token
 * @returns 返回 axios 实例（默认设置好 baseUrl 和 token【如果有的话】）
 */
export const createInstanceForBe = (baseUrl: string, token?: string): AxiosInstanceForBe => {
    return axios.create({
        baseURL: baseUrl,
        headers: token
            ? {
                Authorization: token,
            }
            :
            {},
    });
};

export const createInstanceForDeepSeek = (token: string): AxiosInstanceForDeepSeek => {
    return axios.create({
        baseURL: "https://api.deepseek.com/v1/",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
        maxContentLength: 1024 * 1024 * 50,
        maxBodyLength: 1024 * 1024,
    });
}
