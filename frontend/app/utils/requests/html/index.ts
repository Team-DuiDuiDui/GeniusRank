import { AxiosInstance } from "axios"
import { handleClientReq } from "../request"

export const getFollowersHTML = async (instance: AxiosInstance, username: string, page: number): Promise<string> => {
    handleClientReq(
        async () => await instance.get(`https://github.com/${username}?tab=followers&page=${page}`),
        async (res) => res.data,
        
    )
}