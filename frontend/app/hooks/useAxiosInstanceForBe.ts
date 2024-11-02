import { AxiosInstanceForBe, createInstanceForBe } from '~/api/instance';

/**
 * 用于【 闭包 】创建后端 axios 实例，防止重复创建浪费内存
 * @returns 后端 axios 实例
 */
const useAxiosInstanceForBe = (token?: string): () => AxiosInstanceForBe => {
    const instance = createInstanceForBe(token);
    return () => instance;
};

export default useAxiosInstanceForBe;
