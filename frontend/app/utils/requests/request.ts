import toast from 'react-hot-toast';
import { AxiosInstanceForGithub } from './instance';
import axios, { AxiosResponse } from 'axios';
import i18next from 'i18next';
import sleep from '../sleep';
import { loading } from '../toastLoading';

export interface GraphQLRequest<T> {
    data: T;
    errors?: GraphQLError[];
}

interface GraphQLError {
    message: string;
    locations?: ErrorLocation[];
    path?: (string | number)[];
    extensions?: ErrorExtensions;
}

interface ErrorLocation {
    line: number;
    column: number;
}

interface ErrorExtensions {
    code?: string;
    classification?: string;
}

/**
 * 【 **通用** 】的请求处理函数。
 * 
 * 该函数用于处理支持重试机制的请求，并根据请求结果显示相应的提示信息。
 * 
 * @template T - 请求成功时返回的数据类型
 * @param {() => Promise<AxiosResponse>} req - 发起请求的函数，返回一个解析为 AxiosResponse 的 Promise
 * @param {(data: AxiosResponse) => Promise<T>} success - 处理成功响应的函数，接收 AxiosResponse，返回一个解析为类型 T 的 Promise
 * @param {(error: unknown) => void | boolean | Promise<void | boolean>} [errorResolve] - 可选的错误处理函数，返回值为可选的 boolean 或 Promise<boolean>，返回 true 时会重试
 * @param {number} [maxRetries=0] - 最大重试次数，默认为 0（不重试）
 * @param {boolean} [toast_error=false] - 是否在请求失败时显示错误提示，默认为 false
 * @param {boolean} [toast_success=false] - 是否在请求成功时显示成功提示，默认为 false
 * @param {(data?: AxiosResponse) => void} [retrySuccessSideEffect] - 可选的重试成功后执行的副作用函数，接收 AxiosResponse 作为可选参数
 * @returns {Promise<T>} 返回一个解析为类型 T 的 Promise，如果请求失败并超过重试次数，将抛出错误
 */
export const handleRequest = async <T>(
    req: () => Promise<AxiosResponse>,
    success: (data: AxiosResponse) => Promise<T>,
    errorResolve?: (error: unknown) => void | boolean | Promise<void | boolean>,
    // failResolve?: (error: unknown) => void | boolean | Promise<void | boolean>,
    maxRetries: number = 0,
    toast_error?: boolean,
    toast_success?: boolean,
    retrySuccessSideEffect?: (data?: AxiosResponse) => void,
): Promise<T | undefined> => {

    let attempt = 0;

    while (attempt <= maxRetries) {
        try {
            const res = await req();
            const result = await success(res);
            if (attempt > 0 && retrySuccessSideEffect) {
                retrySuccessSideEffect(res);
            }
            if (toast_success) {
                toast.success(i18next.t('user.success.success'));
            }
            return result;
        } catch (error) {
            if (toast_error) {
                toast.error((error as Error).toString());
            }

            if (errorResolve) {
                const resultUnchecked = errorResolve(error);
                const result = resultUnchecked instanceof Promise ? await resultUnchecked : resultUnchecked;
                if (result) {
                    attempt++;
                    continue;
                } else {
                    break;
                }
            } else {
                throw error;
            }
        }
    }

    throw new Error(i18next.t('user.err.network_error'));
}

    /**
     * 这是只在 handleClientReq 函数的基础上封装了一层，用于处理客户端请求。
     * 设置了在 error 的情况下会将他 toast 出来，而不是直接抛出错误。
     *
     * @template T - 请求成功时返回的数据类型
     * @param req - 发起请求的函数
     * @param success - 处理成功响应的函数
     * @param errorResolve - 处理错误的函数，默认为抛出错误
     * @param maxRetries - 最大重试次数，默认为 0
     * @param toast_error - 是否在请求失败时显示错误 toast 提示，默认为 false
     * @param toast_success - 是否在请求成功时显示成功 toast 提示，默认为 false
     * @returns 返回包含请求结果的 Promise 对象，如果请求失败且未达到最大重试次数，则返回 undefined
     */
    export const handleClientReq = async <T>(
        req: () => Promise<AxiosResponse>,
        success: (data: AxiosResponse) => Promise<T>,
        errorResolve?: (error: unknown) => void,
        maxRetries: number = 0,
        toast_error: boolean = true,
        toast_success?: boolean
    ): Promise<T | undefined> => {
        return handleRequest(req, success, errorResolve, maxRetries, toast_error, toast_success);
    };

    /**
     * 这是一个一定程度上封装后的 handleClientReq 函数，错误处理已经封装好了。只会在 433 的情况下重试
     * 处理 客户端 对于 Github 请求的函数。
     *
     * @template T - 请求成功时返回的数据类型
     * @param req - 发起请求的函数
     * @param success - 处理成功响应的函数
     * @param errorResolve - 处理错误的函数，默认为抛出错误
     * @param maxRetries - 最大重试次数，默认为 0
     * @param toast_error - 是否在请求失败时显示错误 toast 提示，默认为 false
     * @param toast_success - 是否在请求成功时显示成功 toast 提示，默认为 false
     * @returns 返回包含请求结果的 Promise 对象，如果请求失败且未达到最大重试次数，则返回 undefined
     */
    export const handleClientGithubReq = async <T>(
        req: () => Promise<AxiosResponse>,
        success: (data: AxiosResponse) => Promise<T>,
        errorResolve?: (error: unknown) => void,
        maxRetries: number = 3,
        toast_error: boolean = false,
        toast_success?: boolean
    ): Promise<T | undefined> => {
        return handleRequest(req,
            async (res) => {
                success(res)
                return res.data
            },
            async (err) => {
                if (errorResolve) {
                    errorResolve(err)
                }

                if (axios.isAxiosError(err) && err.response?.headers['x-ratelimit-remaining'] == 0) {
                    const localTime = new Date().getTime();
                    const resetTime = parseInt(err.response?.headers['x-ratelimit-reset']) * 1000;
                    loading((resetTime - localTime + 5000)/1000)
                    await sleep(resetTime - localTime + 5000);
                    toast.dismiss('user_reload');
                    return true;
                } else {
                    return false;
                }
            }, 
            maxRetries, 
            toast_error, 
            toast_success, 
            ()=>toast.success(i18next.t('user.success.reloadSuccess'), {
                id: 'user_reload',
            }));
    };

    /**
     * 处理服务器端请求的函数。
     *
     * @template T - 请求成功时返回的数据类型
     * @param req - 发起请求的函数
     * @param success - 处理成功响应的函数
     * @returns 返回包含请求结果的 Promise 对象
     */
    export const handleServerReq = async <T>(
        req: () => Promise<AxiosResponse>,
        success: (data: AxiosResponse) => Promise<T>,
        errorResolve?: (error: unknown) => void
    ): Promise<T | undefined> => {
        return handleRequest(req, success, errorResolve, 0, false, false);
    };

    /**
     * 处理服务器端 GraphQL 请求的函数。
     *
     * @template T - 请求成功时返回的数据类型
     * @param req - 发起请求的函数
     * @param success - 处理成功响应的函数
     * @returns 返回包含请求结果的 Promise 对象
     */
    export const handleServerGraphQLReq = async <T>(
        req: () => Promise<AxiosResponse>,
        success: (data: AxiosResponse) => Promise<T>
    ): Promise<T | undefined> => {
        return handleRequest(req, success, undefined, 0, false, false);
    };

    /**
     * 这是一个高度封装后的 handleClientReq 函数，专门用于处理客户端 GitHub 请求。
     * 处理客户端 GitHub GraphQL 请求的函数。
     * 因为 GitHub GraphQL API 的风控更严格，不是靠重试就能够解决
     * 且服务更稳定几乎不会返回 403 和 500 错误，所以不需要重试。
     *
     * @template T - 请求成功时返回的数据类型
     * @param req - 请求参数对象
     * @param req.axiosInstance - 用于发起请求的 Axios 实例
     * @param req.query - GraphQL 查询字符串
     * @param req.variables - GraphQL 查询变量
     * @param success - 处理成功响应的函数
     * @returns 返回包含请求结果的 Promise 对象
     */
    export const handleClientGithubGraphQLReq = async <T>(
        req: {
            axiosInstance: AxiosInstanceForGithub;
            query: string;
            variables: Record<string, unknown>;
        },
        success: (data: AxiosResponse) => Promise<T>
    ): Promise<T | undefined> => {
        return handleRequest(
            () => {
                return req.axiosInstance.post('/graphql', {
                    query: req.query,
                    variables: req.variables,
                });
            },
            success,
            undefined,
            0,
            true,
            false
        );
    };
