import { AxiosInstanceForGithub } from '../../api/github/instance';
import { AxiosInstanceForBe, AxiosInstanceForDeepSeek } from '~/api/backend/instance';
import {
    guessRegionFromFollowersBetter,
    guessRegionFromGLM,
    guessRegionFromReadme,
} from './nation';
import { updateUserNation } from '~/api/backend/region';
import { syncChatFromDeepSeek } from '~/api/backend/chat';
import { SubUserDetail } from '~/api/github/graphql/typings/user';

export interface GuessNationProps {
    locale: string;
    beInstance: AxiosInstanceForBe;
    githubInstance: AxiosInstanceForGithub;
    deepSeekInstance: AxiosInstanceForDeepSeek;
    userData: UserDataProps;
    dataFromBe: NationData | null;
}

interface NationData {
    nationISO: string;
    confidence: number;
    login: string;
    message: string;
}

export interface UserDataProps {
    t: (key: string) => string;
    location?: string;
    followers: { nodes: SubUserDetail[], totalCount: number };
    followings: { nodes: SubUserDetail[], totalCount: number };
    readme: { defaultBranchRef: { name: string } } | null;
    login: string;
}

const checkAndUpdateBeData = async (newData: NationData, beData: NationData | null, beInstance: AxiosInstanceForBe): Promise<NationData> => {
    if (!beData) {
        await updateUserNation(newData, beInstance);
        console.log("后端没有数据")
        return newData
    }
    if (beData.nationISO !== newData.nationISO) {
        if (beData.confidence > 0.5) {
            await updateUserNation({ ...beData, confidence: beData.confidence * 0.7 }, beInstance);
            console.log("后端数据不够烂")
            return newData;
        }
        await updateUserNation(newData, beInstance);
        console.log("新数据更好")
        return newData;
    }
    console.log("后端数据更好")
    const result = { ...beData, confidence: Math.min(beData.confidence * 1.3, 0.99) }
    await updateUserNation(result, beInstance);
    return result;
}

// TODO: 创建一个任务队列，用于存储非必要任务，但是可以执行的。
// TODO: 比如在有条件的情况下重新获取当前用户的 nation 并且做出比较，并且做出置信度更新
/**
 * 猜测用户最近所在国家和国籍
 * @param locale 当前语言
 * @param userData 用户数据
 * @param beInstance 后端 axios 实例
 * @param githubInstance 前端与 github 通信的 axios 实例
 * @returns 返回还没做完
 */
export const guessRegion = async ({
    userData,
    beInstance,
    githubInstance,
    deepSeekInstance,
    dataFromBe,
}: GuessNationProps): Promise<NationData> => {
    // throw new Error('Not implemented');
    const time = new Date().getTime();
    console.log('BackEnd Data Time:', new Date().getTime() - time);
    try {
        if (userData.followers.totalCount > 50000) {
            const dataFromGLM = await guessRegionFromGLM(userData.login, deepSeekInstance);
            if (dataFromGLM?.nationISO) return await checkAndUpdateBeData(dataFromGLM, dataFromBe, beInstance);
        }

        const dataFromReadme = await guessRegionFromReadme(userData, deepSeekInstance, githubInstance);
        if (dataFromReadme.nationISO) return await checkAndUpdateBeData(dataFromReadme, dataFromBe, beInstance);
        console.log('Readme Data Time:', new Date().getTime() - time);

        if (userData.followers.totalCount < 40 && userData.location) {
            const nationISO = JSON.parse(await syncChatFromDeepSeek(`请你告诉我这个位置信息对应的国家在哪里${userData.location}，你只需要返回这个国家对应的 ISO 代码即可，不需要多余返回任何内容`, deepSeekInstance));
            console.log(nationISO)
            return await checkAndUpdateBeData({
                nationISO: nationISO,
                confidence: 0.5,
                login: userData.login,
                message: 'user.info.no_full_data',
            }, dataFromBe, beInstance);
        }

        const dataFromFollowers = await guessRegionFromFollowersBetter(userData, deepSeekInstance);
        if (dataFromFollowers.nationISO) return await checkAndUpdateBeData(dataFromFollowers, dataFromBe, beInstance);

        // const dataFromFollowings = await guessRegionFromFollowings(userData, deepSeekInstance, githubInstance);
        // if (dataFromFollowings.nationISO) return await checkAndUpdateBeData(dataFromFollowings, dataFromBe, beInstance);
    } catch (error) {
        console.log(error)
        if (dataFromBe) return dataFromBe;
    }

    return {
        nationISO: '',
        confidence: 0,
        login: userData.login,
        message: 'user.info.from_followers_and_followings',
    }
};

