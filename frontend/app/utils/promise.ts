
/**
 * 判断参数变量是否是一个Promise对象
 * @param obj 变量本身
 * @returns 是否是Promise对象
 */
export const isPromise = (obj: unknown): obj is Promise<unknown> => {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && 'then' in obj && typeof (obj as PromiseLike<unknown>).then === 'function';
}