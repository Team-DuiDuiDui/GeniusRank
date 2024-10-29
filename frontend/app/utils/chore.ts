import cloneDeep from 'lodash/cloneDeep';


/**
 * 判断参数变量是否是一个Promise对象
 * @param obj 变量本身
 * @returns 是否是Promise对象
 */
export const isPromise = (obj: unknown): obj is Promise<unknown> => {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && 'then' in obj && typeof (obj as PromiseLike<unknown>).then === 'function';
}

/**
 * 实现防抖函数
 * @param func 需要防抖的函数
 * @returns 包装后的防抖函数
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: unknown[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

/**
 * **谨慎使用**：实现防抖函数
 * 深拷贝参数，增加性能开销
 * @param func 需要防抖的函数
 * @returns 包装后的防抖函数
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const throttleWithDeepClone = (func: Function, delay: number) => {
    let lastCall = 0;
    let timerId: NodeJS.Timeout | null = null;
    let lastArgs: unknown[] | null = null;

    return function (...args: unknown[]) {
        const now = new Date().getTime();

        // TODO: 参考一下性能开销，有没有必要用深拷贝
        // 深拷贝参数，防止参数被修改
        lastArgs = cloneDeep(args);

        if (now - lastCall < delay) {
            if (timerId) {
                clearTimeout(timerId);
            }

            timerId = setTimeout(() => {
                lastCall = new Date().getTime();
                func(...(lastArgs as unknown[]));
            }, delay - (now - lastCall));
        } else {
            lastCall = now;
            func(...args);
        }
    };
};

