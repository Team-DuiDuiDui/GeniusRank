import toast from 'react-hot-toast';
import { AxiosInstanceForGithub } from './instance';
import { AxiosResponse } from 'axios';

export const handleRequest = async <T>(
    req: () => Promise<AxiosResponse>,
    success: (data: AxiosResponse) => Promise<T>,
    errorResolve?: (error: unknown) => void,
    maxRetries: number = 0,
    toast_error?: boolean,
    toast_success?: boolean,
    shouldRetry?: (error: unknown) => boolean
): Promise<T | undefined> => {
    if (!errorResolve) {
        errorResolve = (error) => {
            throw error;
        };
    }

    let attempt = 0;

    while (attempt <= maxRetries) {
        try {
            const res = await req();
            const result = await success(res);
            if (toast_success) {
                toast.success('Success');
            }
            return result;
        } catch (error) {
            const shouldRetryCondition = shouldRetry ? shouldRetry(error) : true;

            if (shouldRetryCondition) {
                attempt++;
                if (attempt < maxRetries) {
                    continue;
                }
            }

            if (toast_error) {
                toast.error((error as Error).toString());
            }
            errorResolve(error);
            break;
        }
    }
};

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

export const handleClientGithubReq = async <T>(
    req: () => Promise<AxiosResponse>,
    success: (data: AxiosResponse) => Promise<T>,
    errorResolve?: (error: unknown) => void,
    maxRetries: number = 0,
    toast_error: boolean = true,
    toast_success?: boolean
): Promise<T | undefined> => {
    return handleRequest(req, success, errorResolve, maxRetries, toast_error, toast_success, (error) => {
        const statusCode = (error as { response?: { status?: number } })?.response?.status; // 假设错误对象中包含响应状态码

        if (statusCode !== 403 && statusCode !== 500) {
            return true;
        } else {
            return false;
        }
    });
};

export const handleServerReq = async <T>(
    req: () => Promise<AxiosResponse>,
    success: (data: AxiosResponse) => Promise<T>
): Promise<T | undefined> => {
    return handleRequest(req, success, undefined, 0, false, false);
};

export const handleServerGraphQLReq = async <T>(
    req: () => Promise<AxiosResponse>,
    success: (data: AxiosResponse) => Promise<T>
): Promise<T | undefined> => {
    return handleRequest(req, success, undefined, 0, false, false);
};

export interface GraphQLRequest<T> {
    data: T;
    errors?: GraphQLError[];
}

interface GraphQLError {
    message: string; // 错误的描述信息
    locations?: ErrorLocation[]; // 可选，出错位置的行号和列号
    path?: (string | number)[]; // 可选，导致错误的 GraphQL 路径
    extensions?: ErrorExtensions; // 可选，附加的错误详情
}

interface ErrorLocation {
    line: number; // 错误发生的行号
    column: number; // 错误发生的列号
}

interface ErrorExtensions {
    code?: string; // 错误代码，如 "UNAUTHENTICATED" 或 "INTERNAL_SERVER_ERROR"
    classification?: string; // 错误类别，如 "Validation" 或 "Execution"
}

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
