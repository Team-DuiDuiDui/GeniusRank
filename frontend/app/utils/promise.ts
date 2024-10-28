export const isPromise = (obj: unknown): obj is Promise<unknown> => {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && 'then' in obj && typeof (obj as PromiseLike<unknown>).then === 'function';
}