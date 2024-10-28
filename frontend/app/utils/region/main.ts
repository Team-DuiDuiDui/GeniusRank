import { User } from '~/utils/requests/ghapis/typings/user';
import { handleClientGithubGraphQLReq } from '../requests/request';
import { AxiosInstanceForGithub } from '../requests/instance';
import { AxiosInstanceForBe } from '~/api/instance';
import { syncChatForNation } from '~/api/chat';

export interface GuessNationProps {
    locale: string;
    beInstance: AxiosInstanceForBe;
    githubInstance: AxiosInstanceForGithub;
    userData: User;
}

export const guessRegion = async ({ locale, userData, beInstance, githubInstance }: GuessNationProps): Promise<string> => {
    const [nationFromFollowers, confidenceFromFollowers] = await guessRegionFromFollowers(userData, beInstance, githubInstance, locale);
    const [nationFromFollowings, confidenceFromFollowings] = await guessRegionFromFollowings(userData, beInstance, githubInstance, locale);
    return nationFromFollowers;
};

const guessRegionFromFollowers = async (userData: User, beInstance: AxiosInstanceForBe, githubInstance: AxiosInstanceForGithub, locale: string): Promise<[string, number]> => {
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
    const data = (await handleClientGithubGraphQLReq<string[]>(
        { axiosInstance: githubInstance, query, variables },
        async res => {
            const result: string[] = []
            const data = res.data.data.user.followers.nodes
            data.forEach((follower: Followers) => follower.location ? result.push(follower.location) : null)
            return result
        }
    ))!;
    return [await syncChatForNation(data.toString(), locale, beInstance), data.length > 30 ? 1 : data.length / 30 ];
};

const guessRegionFromFollowings = async (
    userData: User,
    beInstance: AxiosInstanceForBe,
    githubInstance: AxiosInstanceForGithub,
    locale: string
): Promise<[string, number]> => {
    interface Following {
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
                following(last: 80) {
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
        }
    `;
    const variables = { userName: userData.login };

    const data = (await handleClientGithubGraphQLReq<string[]>( 
        { axiosInstance: githubInstance, query, variables },
        async res => {
            const result: string[] = [];
            const data = res.data.data.user.following.nodes;

            data.forEach((following: Following) => {
                if (following.location) {
                    result.push(following.location);
                }
            });

            return result;
        }
    ))!;


    return [await syncChatForNation(data.toString(), locale, beInstance), data.length > 30 ? 1 : data.length / 30 ];
};
