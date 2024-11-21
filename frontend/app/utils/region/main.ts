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
import { updateDynamicConfidenceWithDecay } from './confidence';
import axios from 'axios';

export interface GuessNationProps {
    locale: string;
    beInstance: AxiosInstanceForBe;
    githubInstance: AxiosInstanceForGithub;
    deepSeekInstance: AxiosInstanceForDeepSeek;
    userData: UserDataProps;
    dataFromBe: NationData | null;
    time: number;
}

interface NationData {
    nationISO: string;
    confidence: number;
    login: string;
    message: string;
    time: number;
}

export interface UserDataProps {
    t: (key: string) => string;
    location?: string;
    followers: { nodes: SubUserDetail[], totalCount: number };
    followings: { nodes: SubUserDetail[], totalCount: number };
    readme: { defaultBranchRef: { name: string } } | null;
    login: string;
}

async function checkAndUpdateBeData(
    newData: NationData,
    beData: NationData | null,
    beInstance: AxiosInstanceForBe
): Promise<NationData> {
    if (!beData) {
        // 如果后端没有数据，直接写入新数据
        await updateUserNation(newData, beInstance);
        console.log("后端没有数据");
        return newData;
    }

    // 使用动态置信度更新函数
    const updatedData = updateDynamicConfidenceWithDecay(beData, newData);
    await updateUserNation(updatedData, beInstance);
    return updatedData;
}

// async function checkAndUpdateBeData(
//     newData: NationData,
//     beData: NationData | null,
//     beInstance: AxiosInstanceForBe
// ): Promise<NationData> {
//     if (!beData) {
//         // 如果后端没有数据，直接写入新数据
//         await updateUserNation(newData, beInstance);
//         console.log("后端没有数据");
//         return newData;
//     }

//     console.log("dataFromBe:", beData);
//     console.log("newData:", newData);

//     // 使用动态置信度更新函数
//     const updatedData = updateDynamicConfidenceWithDecay(beData, newData);

//     // 如果 nationISO 不同，处理置信度减少的逻辑已经在 `updateDynamicConfidenceWithDecay` 中实现
//     if (beData.nationISO !== newData.nationISO) {
//         if (updatedData.nationISO === beData.nationISO && updatedData.confidence > 0.5) {
//             // 如果置信度减少后仍然保留旧的 nationISO
//             await updateUserNation(updatedData, beInstance);
//             console.log("后端数据不够烂");
//             return newData;
//         }
//         // 否则直接用新数据替代
//         await updateUserNation(updatedData, beInstance);
//         console.log("新数据更好");
//         return updatedData;
//     }

//     // 如果 nationISO 相同
//     await updateUserNation(updatedData, beInstance);
//     console.log("后端数据更好");
//     return updatedData;
// }

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
    time,
}: GuessNationProps): Promise<NationData> => {
    // throw new Error('Not implemented');
    try {
        if (userData.followers.totalCount > 50000) {
            const dataFromGLM = checkRegion(await guessRegionFromGLM(userData.login, deepSeekInstance, time));
            if (dataFromGLM?.nationISO) return await checkAndUpdateBeData(dataFromGLM, dataFromBe, beInstance);
        }

        const dataFromReadme = checkRegion(await guessRegionFromReadme(userData, deepSeekInstance, githubInstance, time));
        if (dataFromReadme.nationISO) return await checkAndUpdateBeData(dataFromReadme, dataFromBe, beInstance);
        console.log('Readme Data Time:', new Date().getTime() - time);

        if (userData.followers.totalCount < 40 && userData.location) {
            const nationISO = await syncChatFromDeepSeek(`请你告诉我这个位置信息对应的国家在哪里${userData.location}，你只需要返回这个国家对应的 ISO 代码即可，不需要多余返回任何内容`, deepSeekInstance);
            console.log(nationISO)
            return await checkAndUpdateBeData(checkRegion({
                nationISO: nationISO,
                confidence: 0.5,
                login: userData.login,
                message: 'user.info.no_full_data',
                time: 0,
            }), dataFromBe, beInstance);
        }
        const dataFromFollowers = checkRegion(await guessRegionFromFollowersBetter(userData, deepSeekInstance, time));
        console.log('dataFromFollowers:', dataFromFollowers);
        if (dataFromFollowers.nationISO) return await checkAndUpdateBeData(dataFromFollowers, dataFromBe, beInstance);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
        } else {
            console.log(error)
        }
        if (dataFromBe?.nationISO) return dataFromBe;
        throw new Error('无法判断');
    }

    return {
        nationISO: '',
        confidence: 0,
        login: userData.login,
        message: 'user.info.from_followers_and_followings',
        time: 0,
    }
};

export const checkRegion = (data: NationData): NationData => {
    const result = { ...data };
    if (data.nationISO === "TW" || data.nationISO === "HK" || data.nationISO === "MO") {
        result.nationISO = "CN";
    }
    return result;
}