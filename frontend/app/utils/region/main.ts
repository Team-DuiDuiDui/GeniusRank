import { AxiosInstanceForGithub } from '../requests/instance';
import { AxiosInstanceForBe } from '~/api/instance';
import { guessRegionFromFollowers, guessRegionFromFollowings, guessRegionFromReadme } from './nation';

export interface GuessNationProps {
    t: (key: string) => string;
    locale: string;
    beInstance: AxiosInstanceForBe;
    githubInstance: AxiosInstanceForGithub;
    userData: UserDataProps;
}

export interface UserDataProps {
    t: (key: string) => string;
    followers: number;
    followings: number;
    login: string;
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
    t,
    userData,
    beInstance,
    githubInstance,
}: GuessNationProps): Promise<{
    nationISO: string;
    nationName: string;
    message: string;
    confidence: number;
}> => {
    // throw new Error('Not implemented');
    // const nationDataFromBe = await getUserNation(userData.login, beInstance);
    // if (nationDataFromBe !== null ) return nationDataFromBe;
    const dataFromReadme = await guessRegionFromReadme(userData, beInstance, githubInstance);
    if (dataFromReadme.nationISO) return { ...dataFromReadme, message: t('user.info.from_readme'), confidence: 0.99 };
    const dataFromFollowers = await guessRegionFromFollowers(userData, beInstance, githubInstance);
    const dataFromFollowings = await guessRegionFromFollowings(userData, beInstance, githubInstance);
    if (dataFromFollowings.nationISO === dataFromFollowers.nationISO)
        return {
            ...dataFromFollowings,
            message: t('user.info.from_followers_and_followings'),
            confidence: (dataFromFollowers.confidence + dataFromFollowings.confidence) * 0.8,
        };
    else {
        if (dataFromFollowers.confidence > dataFromFollowings.confidence)
            return {
                ...dataFromFollowers,
                message: t('user.info.from_followers'),
                confidence: dataFromFollowers.confidence,
            };
        else
            return {
                ...dataFromFollowings,
                message: t('user.info.from_followings'),
                confidence: dataFromFollowings.confidence,
            };
    }
    // return {nationISO: nationFromFollowers, nationName: nationFromFollowers, confidence: confidenceFromFollowers};
};
