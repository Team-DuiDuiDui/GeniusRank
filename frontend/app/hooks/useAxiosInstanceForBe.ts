import { useState, useEffect, useRef } from 'react';
import { AxiosInstanceForBe, createInstanceForBe } from '~/api/instance';

/**
 * 用于【 闭包 】创建后端 axios 实例，防止重复创建浪费内存
 * @returns 后端 axios 实例
 */
const useAxiosInstanceForBe = (baseUrl: string, token?: string): AxiosInstanceForBe | undefined => {
    const currentToken = useRef<string | null>(null);
    const [isClient, setIsClient] = useState<boolean>(false);
    const [instance, setInstance] = useState<() => AxiosInstanceForBe | undefined>();

    // 仅在客户端设置标志
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        // 仅在客户端运行
        if (!isClient) return;
        if (token && token !== currentToken.current) {
            setInstance(() => () => createInstanceForBe(baseUrl, token));
            currentToken.current = token;
        } else setInstance(() => () => createInstanceForBe(baseUrl));
    }, [baseUrl, isClient, token]);

    return instance?.();
};

export default useAxiosInstanceForBe;
