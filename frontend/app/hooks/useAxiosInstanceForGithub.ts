import { AxiosInstanceForGithub, createInstanceForGithub } from '~/utils/requests/instance';

/**
 * 用于【 闭包 】创建前端与 github 的 api 通信的 axios 实例，防止重复创建浪费内存
 * @returns axios 实例
 */
const useAxiosInstanceForGithub = (token?: string): () => AxiosInstanceForGithub => {
    const instance = createInstanceForGithub(token);
    return () => instance;
};


export default useAxiosInstanceForGithub;
