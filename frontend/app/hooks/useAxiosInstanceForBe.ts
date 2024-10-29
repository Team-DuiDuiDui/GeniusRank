import { useState, useEffect, useRef } from 'react'
import { AxiosInstanceForBe, createInstanceForBe } from '~/api/instance'

/**
 * 用于【 闭包 】创建后端 axios 实例，防止重复创建浪费内存
 * @returns 后端 axios 实例
 */
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

        const token = localStorage.getItem('token')
        if (token && token !== currentToken.current) {
            const newAxiosInstance = createInstanceForBe(token)
            setAxiosInstance(newAxiosInstance)
            currentToken.current = token
        }

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

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [isClient])

    return axiosInstance
}

export default useAxiosInstanceForBe
