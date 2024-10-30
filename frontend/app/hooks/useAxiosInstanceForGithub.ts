import { useState, useEffect, useRef } from 'react';
import { AxiosInstanceForGithub, createInstanceForGithub } from '~/utils/requests/instance';

/**
 * 用于【 闭包 】创建前端与 github 的 api 通信的 axios 实例，防止重复创建浪费内存
 * @returns axios 实例
 */
const useAxiosInstanceForGithub = (): AxiosInstanceForGithub | undefined => {
    const [axiosInstance, setAxiosInstance] = useState<AxiosInstanceForGithub>();
    const currentToken = useRef<string | null>(null);
    const [isClient, setIsClient] = useState<boolean>(false);

    // 仅在客户端设置标志
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        // 仅在客户端运行
        if (!isClient) return;

        const token = localStorage.getItem('GITHUB_ACCESS_TOKEN');
        if (token && token !== currentToken.current) {
            const newAxiosInstance = createInstanceForGithub(token);
            setAxiosInstance(newAxiosInstance);
            currentToken.current = token;
        }

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'GITHUB_ACCESS_TOKEN') {
                const newToken = event.newValue;
                if (newToken && newToken !== currentToken.current) {
                    const newAxiosInstance = createInstanceForGithub(newToken);
                    setAxiosInstance(newAxiosInstance);
                    currentToken.current = newToken;
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [isClient]);

    return axiosInstance;
};

export default useAxiosInstanceForGithub;
