import { NationData, syncChatForNationFromReadme, syncChatForNationFromUserList } from "~/api/chat";
import { AxiosInstanceForBe } from "~/api/instance";
import { User } from "../requests/ghapis/typings/user";
import { AxiosInstanceForGithub } from "../requests/instance";
import { handleClientGithubGraphQLReq } from "../requests/request";
import { UserDetail } from "../requests/ghGraphql/typings/user";


/**
 * 从用户的 followers 角度猜测用户所在国家
 * @params 同 guessRegion
 * @returns 返回一个数组，第一个元素是国家，第二个元素是置信度
 */
export const guessRegionFromFollowers = async (userData: UserDetail, beInstance: AxiosInstanceForBe, githubInstance: AxiosInstanceForGithub, locale: string): Promise<NationData> => {
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
                        followers(last: ${userData.followers.totalCount <= 80 ? userData.followers : 80}) {
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

    let loopCount = 0
    while (loopCount < 3) {
        loopCount++;
        const resultJSON = await syncChatForNationFromUserList(data.toString(), locale, beInstance);
        if (resultJSON.nationLocale) return resultJSON;
    }
    return { nationName: "", nationISO: "", nationLocale: "" }
};

/**
 * 从用户的 followings 角度猜测用户所在国家
 * @params 同 guessRegion
 * @returns 返回一个数组，第一个元素是国家，第二个元素是置信度
 */
export const guessRegionFromFollowings = async (
    userData: UserDetail,
    beInstance: AxiosInstanceForBe,
    githubInstance: AxiosInstanceForGithub,
    locale: string
): Promise<NationData> => {
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
                following(last: ${userData.following.totalCount <= 80 ? userData.following : 80}) {
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

    let loopCount = 0
    while (loopCount < 3) {
        loopCount++;
        const resultJSON = await syncChatForNationFromUserList(data.toString(), locale, beInstance);
        if (resultJSON.nationISO) return resultJSON;
    }
    return { nationName: "", nationISO: "", nationLocale: "" };
};

export const guessRegionFromReadme = async (
    userData: User, 
    beInstance: AxiosInstanceForBe, 
    githubInstance: AxiosInstanceForGithub, 
    locale: string
): Promise<NationData> => {
    const branchQuery = `
    query($userName: String!) {
        user(login: $userName) {
            repository(name: $userName) {
                object(expression: "master:README.md") {
                    ... on Blob {
                        text
                    }
                }
            }
        }
    }
    `;
    const variables = { userName: userData.login };
    const branchName = await handleClientGithubGraphQLReq<string | undefined>(
        { axiosInstance: githubInstance, query: branchQuery, variables },
        async res => res.data.user?.repository?.refs?.edges[0]?.node?.name
    );

    if (!branchName) return { nationName: "", nationISO: "", nationLocale: "" };

    const readmeQuery = `
        query($userName: String!, $branchName: String!) {
        user(login: $userName) {
            repository(name: $userName) {
                object(expression: "${branchName}:README.md") {
                    ... on Blob {
                        text
                    }
                }
            }
        }
    }`

    const readme = await handleClientGithubGraphQLReq<string | undefined>(
        { axiosInstance: githubInstance, query: readmeQuery, variables },
        async res => res.data.user?.repository?.object?.text
    );
    if (!readme) return { nationName: "", nationISO: "", nationLocale: "" };

    let loopCount = 0
    while (loopCount < 3) {
        loopCount++;
        const resultJSON = await syncChatForNationFromReadme(readme.toString(), locale, beInstance);
        if (resultJSON.nationName) return resultJSON;
    }
    return { nationName: "", nationISO: "", nationLocale: "" };
}