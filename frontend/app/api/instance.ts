import axios, { AxiosInstance } from "axios";

export interface AxiosInstanceForBe extends AxiosInstance {}

/**
 * 创建后端 axios 实例
 * @param token 用户用来与后端接口通信的 token
 * @returns 返回 axios 实例（默认设置好 baseUrl 和 token【如果有的话】）
 */
export const createInstanceForBe = (token?: string): AxiosInstanceForBe => {
    return axios.create({
        baseURL: 'https://5d67-2001-250-6c01-8000-00-37-2640.ngrok-free.app/api',
        headers: token ? {
            Authorization: token ,
        }: {}
    });
}