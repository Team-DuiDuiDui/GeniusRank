import { AxiosResponse } from 'axios';
import { AxiosInstanceForBe, createInstanceForBe } from '~/api/backend/instance';

/**
 * 用于创建后端 axios 实例，防止重复创建浪费内存
 * @returns 后端 axios 实例
 */
const useAxiosInstanceForBe = (baseUrl: string, token?: string): (() => AxiosInstanceForBe) => {
    const instance = createInstanceForBe(baseUrl, token);
    return () => instance;
};

export default useAxiosInstanceForBe;

export class BackEndError extends Error {
    response: AxiosResponse;
    error: string;
    constructor(response: AxiosResponse, error: string) {
        super(response.data.message);
        this.response = response;
        this.error = error;
    }
}
