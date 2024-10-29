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

/**
 * 猜测用户最近所在国家和国籍
 * @param locale 当前语言
 * @param userData 用户数据
 * @param beInstance 后端 axios 实例
 * @param githubInstance 前端与 github 通信的 axios 实例
 * @returns 返回还没做完
 */
export const guessRegion = async ({ locale, userData, beInstance, githubInstance }: GuessNationProps): Promise<string> => {
    const [nationFromFollowers, confidenceFromFollowers] = await guessRegionFromFollowers(userData, beInstance, githubInstance, locale);
    const [nationFromFollowings, confidenceFromFollowings] = await guessRegionFromFollowings(userData, beInstance, githubInstance, locale);
    return nationFromFollowers;
};

/**
 * 从用户的 followers 角度猜测用户所在国家
 * @params 同 guessRegion
 * @returns 返回一个数组，第一个元素是国家，第二个元素是置信度
 */
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

/**
 * 从用户的 followings 角度猜测用户所在国家
 * @params 同 guessRegion
 * @returns 返回一个数组，第一个元素是国家，第二个元素是置信度
 */
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
