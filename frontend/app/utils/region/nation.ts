import { syncChatForNationFromGLM, syncChatForNationFromReadme, syncChatForNationFromUserList } from "~/api/chat";
import { AxiosInstanceForBe } from "~/api/instance";
import { AxiosInstanceForGithub } from "../requests/instance";
import { handleClientGithubGraphQLReq } from "../requests/request";
import { UserDataProps } from "./main";
import { NationData } from "~/api/region";

const defaultValue: NationData = {
    nationISO: "",
    confidence: 0,
    login: "",
    message: "",
};

/**
 * 从用户的 followers 角度猜测用户所在国家
 * @params 同 guessRegion
 * @returns 返回一个数组，第一个元素是国家，第二个元素是置信度
 */
export const guessRegionFromFollowers = async (
    userData: UserDataProps,
    beInstance: AxiosInstanceForBe,
    githubInstance: AxiosInstanceForGithub
): Promise<NationData> => {
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
    const processedData: string[] = [];

    for (let i = 0; i < data.length; i++) {
        const group = Math.floor(i / 5);
        const repeatCount = group + 1;

        for (let j = 0; j <= repeatCount; j++) {
            processedData.push(data[i]);
        }
    }

    let loopCount = 0
    while (loopCount < 3) {
        loopCount++;
        const resultJSON = await syncChatForNationFromUserList(processedData.toString(), beInstance);
        if (resultJSON.nationISO) return { ...resultJSON, confidence: data.length / (userData.followers > 80 ? 80 : userData.followers), login: userData.login, message: "user.info.from_followers_and_followings" };
    }
    return defaultValue
};

/**
 * 从用户的 followings 角度猜测用户所在国家
 * @params 同 guessRegion
 * @returns 返回一个数组，第一个元素是国家，第二个元素是置信度
 */
export const guessRegionFromFollowings = async (
    userData: UserDataProps,
    beInstance: AxiosInstanceForBe,
    githubInstance: AxiosInstanceForGithub,
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
                following(last: ${userData.followings <= 80 ? userData.followings : 80}) {
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

    const processedData: string[] = [];

    for (let i = 0; i < data.length; i++) {
        const group = Math.floor(i / 5);
        const repeatCount = group + 1;

        for (let j = 0; j <= repeatCount; j++) {
            processedData.push(data[i]);
        }
    }

    let loopCount = 0
    while (loopCount < 3) {
        loopCount++;
        const resultJSON = await syncChatForNationFromUserList(processedData.toString(), beInstance);
        if (resultJSON.nationISO) return { ...resultJSON, confidence: data.length / (userData.followings > 80 ? 80 : userData.followings), login: userData.login, message: "user.info.from_followers_and_followings" };
    }
    return defaultValue
};

export const guessRegionFromReadme = async (
    userData: UserDataProps,
    beInstance: AxiosInstanceForBe,
    githubInstance: AxiosInstanceForGithub,
): Promise<NationData> => {
    const branchQuery = `
    query($userName: String!) {
        user(login: $userName) {
            repository(name: $userName) {
                    defaultBranchRef {
                        name
                    }
                }
            }
        }
    `;
    const variables = { userName: userData.login };
    const branchName = await handleClientGithubGraphQLReq<string | undefined>(
        { axiosInstance: githubInstance, query: branchQuery, variables },
        async res => {
            return res.data.data.user?.repository?.defaultBranchRef?.name
        }
    );

    if (!branchName) return defaultValue;

    const readmeQuery = `
        query($userName: String!) {
        user(login: $userName) {
            repository(name: $userName) {
                object(expression: "${branchName}:README.md") {
                    ... on Blob {
                        text
                    }
                }
            }
        }
    }
        `

    const readme = await handleClientGithubGraphQLReq<string | undefined>(
        { axiosInstance: githubInstance, query: readmeQuery, variables },
        async res => res.data.data.user?.repository?.object?.text
    );
    if (!readme) return defaultValue;

    let loopCount = 0
    while (loopCount < 3) {
        loopCount++;
        const resultJSON = await syncChatForNationFromReadme(readme.toString(), beInstance);
        if (resultJSON.nationName) return { ...resultJSON, confidence: 0.99, login: userData.login, message: "user.info.from_readme" };
    }
    return defaultValue;
}

export const guessRegionFromGLM = async (userName: string, beInstance: AxiosInstanceForBe): Promise<NationData> => {
    return { ...await syncChatForNationFromGLM(userName, beInstance), login: userName, confidence: 0.7, message: 'user.info.from_glm' };
}