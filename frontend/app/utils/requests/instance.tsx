/* eslint-disable import/no-named-as-default-member */
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

/**
 * 创建一个用于 GitHub API 的 Axios 实例。
 *
 * 该实例会自动添加 GitHub API 的 baseURL 和可选的授权头。
 *
 * @param token - 可选的 GitHub 访问令牌
 * @param ua - 可选的用户代理头
 * @param noRetry - 是否禁用重试，默认为 false
 * @param token_type - 令牌类型，默认为 'token'
 * @returns 用于 GitHub API 的 Axios 实例
 */
export const createInstanceForGithub = (
    token?: string,
    ua?: string,
    noRetry?: boolean,
    token_type: 'Bearer' | 'token' = 'token'
): AxiosInstanceForGithub => {
    const instance = axios.create({
        baseURL: 'https://api.github.com',
        headers: {
            Authorization: token ? `${token_type} ${token}` : undefined,
            'User-Agent': ua,
        },
    });
    // if (!noRetry)
    //     interceptor.interceptors.response.use(null, async (err) => {
    //         const { config } = err;
    //         const { retry = 3 } = config;
    //         config._retries = config._retries || 0;
    //         if (config._retries++ >= retry) return Promise.reject(err);
    //         await sleep((Math.pow(3.8, config._retries) / 2 - 1 / 2) * 1000);
    //         return interceptor(config);
    //     });
    return instance;
};

// TODO: 指数避退迁移
// /**
//  * 能在速率限制后根据返回标头选择指数退避或根据标头重试请求，同时显示 toast
//  * @param token github_token
//  */
// export const createInstanceForGithubClient = (token?: string): AxiosInstanceForGithub => {
//     const interceptor = axios.create({
//         baseURL: 'https://api.github.com',
//         headers: token
//             ? {
//                   Authorization: `token ${token}`,
//               }
//             : {},
//     });
//     interceptor.interceptors.response.use(
//         (res) => {
//             const { config } = res;
//             if ((config as { _toastId?: string })._toastId) {
//                 toast.success(i18next.t('user.success.reloadSuccess'), {
//                     id: (config as { _toastId?: string })._toastId,
//                 });
//             }
//             return res;
//         },
//         async (err) => {
//             const { config } = err;
//             const { retry = 3 } = config;
//             config._retries = config._retries || 0;
//             if (config._toastId) {
//                 toast.error(i18next.t('user.err.reloadFailed'), {
//                     id: config._toastId,
//                 });
//             }
//             if (err.response?.headers['x-ratelimit-remaining'] == 0) {
//                 const localTime = new Date().getTime();
//                 const resetTime = Number(err.response?.headers['x-ratelimit-reset']) * 1000;
//                 const toastId = toast.loading(
//                     (tst) => (
//                         <div className="flex flex-row gap-2 items-center">
//                             <p>
//                                 {i18next.t('user.err.reloading_after')}{' '}
//                                 <ClientOnly>
//                                     {() => (
//                                         <CountUp
//                                             start={Math.round((resetTime - localTime) / 1000)}
//                                             end={0}
//                                             delay={0}
//                                             duration={Math.round((resetTime - localTime) / 1000)}
//                                             useEasing={false}
//                                         />
//                                     )}
//                                 </ClientOnly>{' '}
//                                 {i18next.t('user.err.reloading_after_2')}
//                             </p>
//                             <CloseButton onClick={() => toast.dismiss(tst.id)} />
//                         </div>
//                     ),
//                     {
//                         id: 'user_reload',
//                     }
//                 );
//                 config._toastId = toastId;
//                 await sleep(resetTime - localTime);
//                 config._retries++;
//                 toast.loading(i18next.t('user.err.reloading'), {
//                     id: 'user_reload',
//                 });
//                 return interceptor(config);
//             }
//             if (config._retries++ >= retry) return Promise.reject(err);
//             await sleep((Math.pow(3.8, config._retries) / 2 - 1 / 2) * 1000);
//             return interceptor(config);
//         }
//     );
//     return interceptor;
// };