import axios, { AxiosInstance } from "axios";

export interface AxiosInstanceForBe extends AxiosInstance {}

/**
 * 创建后端 axios 实例
 * @param token 用户用来与后端接口通信的 token
 * @returns 返回 axios 实例（默认设置好 baseUrl 和 token【如果有的话】）
 */
export const createInstanceForBe = (token?: string): AxiosInstanceForBe => {
    return axios.create({
        baseURL: 'https://7fac-2409-8938-c88-2955-4541-68be-4e48-a266.ngrok-free.app/api',
        headers: token ? {
            Authorization: token ,
            'User-Agent': 'Team-Duiduidui: Genius Rank',
        }: {}
    });
}