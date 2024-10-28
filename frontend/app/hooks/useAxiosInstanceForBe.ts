import { useState, useEffect, useRef } from 'react'
import { AxiosInstanceForBe, createInstanceForBe } from '~/api/instance'

const useAxiosInstanceForBe = (): AxiosInstanceForBe | undefined => {
    const [axiosInstance, setAxiosInstance] = useState<AxiosInstanceForBe>()
    const currentToken = useRef<string | null>(null)
    const [isClient, setIsClient] = useState<boolean>(false)

    // 仅在客户端设置标志
    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        // 仅在客户端运行
        if (!isClient) return

        // 获取 token
        const token = localStorage.getItem('token')
        if (token && token !== currentToken.current) {
            const newAxiosInstance = createInstanceForBe(token)
            setAxiosInstance(newAxiosInstance)
            currentToken.current = token
        }

        // 监听 localStorage 的变化
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'token') {
                const newToken = event.newValue
                if (newToken && newToken !== currentToken.current) {
                    const newAxiosInstance = createInstanceForBe(newToken)
                    setAxiosInstance(newAxiosInstance)
                    currentToken.current = newToken
                }
            }
        }

        window.addEventListener('storage', handleStorageChange)

        // 清理事件监听器
        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [isClient]) // 依赖于 isClient

    return axiosInstance
}

export default useAxiosInstanceForBe
