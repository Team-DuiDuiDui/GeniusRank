import { AxiosInstanceForBe, createInstanceForBe } from '~/api/instance';

/**
 * 用于创建后端 axios 实例，防止重复创建浪费内存
 * @returns 后端 axios 实例
 */
const useAxiosInstanceForBe = (baseUrl: string, token?: string): (() => AxiosInstanceForBe) => {
    const instance = createInstanceForBe(baseUrl, token);
    return () => instance;
};

export default useAxiosInstanceForBe;
