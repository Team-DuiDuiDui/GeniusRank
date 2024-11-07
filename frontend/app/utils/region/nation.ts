import { syncChat, syncChatForNationFromGLM, syncChatForNationFromReadme, syncChatForNationFromUserList } from "~/api/backend/chat";
import { AxiosInstanceForBe } from "~/api/backend/instance";
import { AxiosInstanceForGithub } from "../../api/github/instance";
import { handleClientGithubGraphQLReq } from "../request";
import { UserDataProps } from "./main";
import { NationData } from "~/api/backend/region";
import { parseStringToArrayLike } from "../parse";
import { calculateNationPrediction, User } from "./betterRegion";

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
                            followings {
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

const prompt = `
这是一个包含了位置信息或者 null 的一个数组。
请你根据你的知识库，判断一下这里面的位置信息都属于哪个国家，并找到对应的 ISO 两个字母的简写形式。
如果是标准国家名称，比如 China ，就返回 CN 。如果不标准，是这个国家中的某个地方，比如 California ，就返回 US 。
需要你返回一个数组，这里面的值是 null 或者将这个不确定格式的位置信息替换为双引号包裹的字符串形式的对应国家的 ISO 简写。
注意：你只需要返回同样的数组即可，不要有任何多余内容，我需要直接将你的答案用到JSON.parse中
`

export const guessRegionFromFollowersBetter = async (
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
        following: {
            totalCount: number;
        };
    }
    const query = `
                query($userName: String!) {
                    user(login: $userName) {
                        followers(last: 80) {
                        nodes {
                            login
                            name
                            location
                            company
                            followers {
                                totalCount
                                }
                            following {
                                totalCount
                                }
                            }
                        totalCount
                        }
                    }
                }`;
    const variables = { userName: userData.login };
    const locationList: User[] = (await handleClientGithubGraphQLReq<User[]>(
        { axiosInstance: githubInstance, query, variables },
        async res => {
            return res.data.data.user.followers.nodes.map((node: Followers) => ({
                location: node.location || null,
                followers: node.followers.totalCount,
                followings: node.following.totalCount
            })).reverse()
        }
    ))!;

    const chatResult = await syncChat(`${locationList.map(node => node.location || "null")} ${prompt}`, beInstance)
    console.log(`${locationList.map(node => node.location || "null")} ${prompt}`)
    console.log(chatResult)
    const resultJSON: string[] = JSON.parse(parseStringToArrayLike(chatResult))
    // console.log(resultJSON)
    const resAll = calculateNationPrediction(locationList.map((item, index) => ({
        ...item,
        location: resultJSON[index] === undefined ? null : resultJSON[index],
    })))
    const res = resAll[0]
    console.log(resAll.slice(0, 5))
    return { ...res, confidence: parseFloat(res.confidence.toFixed(2)), nationISO: res.nation, login: userData.login, message: "user.info.from_followers_and_followings" }
}


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