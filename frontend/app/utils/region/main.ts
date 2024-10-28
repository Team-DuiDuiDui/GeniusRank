import { User } from "~/utils/requests/ghapis/typings/user";
import { AxiosInstance } from "axios";
import { FollowerInfo, parseFollowersHTML } from "../parseHTML/followers";
import sleep from "../sleep";


export interface GuessNationProps {
    axiosInstance: AxiosInstance
    userData: User
}

export const guessRegion = async ({ userData, axiosInstance }: GuessNationProps): Promise<string> => {
    if (userData.followers < 5000) {
        const followers = userData.followers;
        const lastPage = Math.trunc(followers % 50)
        for (let i = lastPage; i >= lastPage - 1; i--) {
            sleep(1000);
        }
    }
} 