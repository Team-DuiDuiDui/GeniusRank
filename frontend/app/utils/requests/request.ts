import toast from "react-hot-toast";

export const handleRequest = async <T, U>(
    req: () => Promise<U>,
    success: (data: U) => Promise<T>,
    errorResolve?: (error: unknown) => void,
    toast_error?: boolean,
    toast_success?: boolean,
): Promise<T | undefined> => {

    if (!errorResolve) {
        errorResolve = (error) => {
            console.error(error);
            throw error;
        };
    }

    try {
        const res = await req();
        const result = success(res);
        if (toast_success) {
            toast.success('Success');
        }
        return result;
    } catch (error) {
        if (toast_error) {
            toast.error((error as Error).toString());
        }
        errorResolve(error);
    }
}

export const handleClientReq = async <T, U>(
    req: () => Promise<U>,
    success: (data: U) => Promise<T>,
    errorResolve?: (error: unknown) => void,
    toast_error: boolean = true,
    toast_success?: boolean,
): Promise<T | undefined> => {
    return handleRequest(req, success, errorResolve, toast_error, toast_success);
}

export const handleServerReq = async <T, U>(
    req: () => Promise<U>,
    success: (data: U) => Promise<T>,
): Promise<T | undefined> => {
    return handleRequest(req, success, undefined, false, false);
}