import { User } from "~/utils/requests/ghapis/typings/user";
import { handleServerReq } from "../requests/request";
import { AxiosInstance } from "axios";


export interface GuessNationProps {
    axiosInstance: AxiosInstance
    userData: User
}

export const guessRegion = async ({ userData }: GuessNationProps): Promise<string> => {
    if (userData.followers < 5000) {
        
    }
} 