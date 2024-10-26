import toast from "react-hot-toast";

export const handleRequest = async <T, U>(
    req: () => Promise<U>,
    success: (data: U) => Promise<T>,
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
            console.log(result)
            if (toast_success) {
                toast.success('Success');
            }
            return result;
        } catch (error) {
            const shouldRetryCondition = shouldRetry ? shouldRetry(error) : true

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


export const handleClientReq = async <T, U>(
    req: () => Promise<U>,
    success: (data: U) => Promise<T>,
    errorResolve?: (error: unknown) => void,
    maxRetries: number = 0,
    toast_error: boolean = true,
    toast_success?: boolean,
): Promise<T | undefined> => {
    return handleRequest(
        req, 
        success, 
        errorResolve, 
        maxRetries, 
        toast_error, 
        toast_success,
    );
}

export const handleClientGithubReq = async <T, U>(
    req: () => Promise<U>,
    success: (data: U) => Promise<T>,
    errorResolve?: (error: unknown) => void,
    maxRetries: number = 0,
    toast_error: boolean = true,
    toast_success?: boolean,
): Promise<T | undefined> => {
    return handleRequest(
        req, 
        success, 
        errorResolve, 
        maxRetries, 
        toast_error, 
        toast_success, 
        (error) => {
            const statusCode = (error as { response?: { status?: number } })?.response?.status; // 假设错误对象中包含响应状态码

            if (statusCode !== 403 && statusCode !== 500) {
                return true;
            } else {
                return false;
            }
        }
    );
}

export const handleServerReq = async <T, U>(
    req: () => Promise<U>,
    success: (data: U) => Promise<T>,
): Promise<T | undefined> => {
    return handleRequest(req, success, undefined, 0, false, false);
}