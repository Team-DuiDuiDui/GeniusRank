import { AxiosInstanceForGithub } from '../../api/github/instance';
import { AxiosInstanceForBe } from '~/api/backend/instance';
import {
    guessRegionFromFollowers,
    guessRegionFromFollowersBetter,
    guessRegionFromFollowings,
    guessRegionFromGLM,
    guessRegionFromReadme,
} from './nation';
import { getUserNation, updateUserNation } from '~/api/backend/region';

export interface GuessNationProps {
    locale: string;
    beInstance: AxiosInstanceForBe;
    githubInstance: AxiosInstanceForGithub;
    userData: UserDataProps;
}

interface NationData {
    nationISO: string;
    confidence: number;
    login: string;
    message: string;
}

export interface UserDataProps {
    t: (key: string) => string;
    followers: number;
    followings: number;
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
}: GuessNationProps): Promise<NationData> => {
    // throw new Error('Not implemented');
    const dataFromBe = await getUserNation(userData.login, beInstance);
    if (dataFromBe?.confidence === 1) {
        console.log("共识")
        return dataFromBe
    }
    try {
        if (userData.followers > 50000) {
            const dataFromGLM = await guessRegionFromGLM(userData.login, beInstance);
            if (dataFromGLM?.nationISO) return await checkAndUpdateBeData(dataFromGLM, dataFromBe, beInstance);
        }
        const dataFromReadme = await guessRegionFromReadme(userData, beInstance, githubInstance);
        if (dataFromReadme.nationISO) return await checkAndUpdateBeData(dataFromReadme, dataFromBe, beInstance);

        const dataFromFollowers = await guessRegionFromFollowersBetter(userData, beInstance, githubInstance);
        if (dataFromFollowers.nationISO) return await checkAndUpdateBeData(dataFromFollowers, dataFromBe, beInstance);

        const dataFromFollowings = await guessRegionFromFollowings(userData, beInstance, githubInstance);
        if (dataFromFollowings.nationISO) return await checkAndUpdateBeData(dataFromFollowings, dataFromBe, beInstance);
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

