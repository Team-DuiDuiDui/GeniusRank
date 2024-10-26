import { User } from "~/utils/requests/ghapis/typings/user";
import { handleServerReq } from "../requests/request";


export interface GuessNationProps {
    userData: User
}

export const guessNation = async ({ userData }: GuessNationProps): Promise<string> => {
    if (userData.followers < 5000) {
        handleServerReq()
    }
} 