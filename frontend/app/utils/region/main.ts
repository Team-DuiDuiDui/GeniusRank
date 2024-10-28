import { User } from '~/utils/requests/ghapis/typings/user';
import { AxiosInstance } from 'axios';
import { handleClientGithubGraphQLReq } from '../requests/request';

export interface GuessNationProps {
    axiosInstance: AxiosInstance;
    userData: User;
}

export const guessRegion = async ({ userData, axiosInstance }: GuessNationProps): Promise<string> => {
    guessRegionFromFollowers(userData, axiosInstance);
    return "";
};  

const guessRegionFromFollowers = async (userData: User, axiosInstance: AxiosInstance): Promise<string> => {
    interface Followers {
        login: string;
        name: string;
        location: string;
        company: string;
        followers: {
            totalCount: number;
        };
    }
    const query = `
                query($userName: String!) {
                    user(login: $userName) {
                        followers(last: ${userData.followers <= 80 ? userData.followers : 80}) {
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
                }`;
    const variables = { userName: userData.login };
    const data = await handleClientGithubGraphQLReq<string[]>(
        { axiosInstance, query, variables },
        async res => {
            const result: string[] = []
            const data = res.data.data.user.followers.nodes
            data.forEach((follower: Followers) => follower.location ? result.push(follower.location) : null)
            return result
        }
    );
    console.log(data);
    return '';
};
