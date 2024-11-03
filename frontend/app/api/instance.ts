import axios, { AxiosInstance } from 'axios';

export interface AxiosInstanceForBe extends AxiosInstance {}

/**
 * 创建后端 axios 实例
 * @param token 用户用来与后端接口通信的 token
 * @returns 返回 axios 实例（默认设置好 baseUrl 和 token【如果有的话】）
 */
export const createInstanceForBe = (token?: string): AxiosInstanceForBe => {
    return axios.create({
        baseURL: '',
        headers: token
            ? {
                  Authorization: token,
              }
            : {},
    });
};
