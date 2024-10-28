import { User } from "~/utils/requests/ghapis/typings/user";
import { AxiosInstance, AxiosResponse } from "axios";
import sleep from "../sleep";
import { handleClientGithubGraphQLReq } from "../requests/request";
import UserInfo from "~/components/userinfo/info";


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

const guessRegionFromFollowers = async (userData: User, axiosInstance: AxiosInstance): Promise<string> => {
    interface Followers {
        login: string
        name: string
        location: string
        company: string
        followers: {
            totalCount: number
        }
    }
    const query = `
                query($userName: String!) {
                    user(login: $userName) {
                        followers(last: 50) {
                        nodes {
                            login
                            name
                            location
                            company
                            followers {
                                totalCount
                                }
                            }
                        totalCount 
                        }
                    }
                }`
    const variables = { userName: userData.name! }
    const data = handleClientGithubGraphQLReq<Followers[]>(
        { axiosInstance, query, variables },
        (res) => (res as AxiosResponse).data.user.followers.nodes
    )
}