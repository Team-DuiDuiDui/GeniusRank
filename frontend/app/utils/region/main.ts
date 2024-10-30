import { User } from '~/utils/requests/ghapis/typings/user';
import { handleClientGithubGraphQLReq } from '../requests/request';
import { AxiosInstanceForGithub } from '../requests/instance';
import { AxiosInstanceForBe } from '~/api/instance';
import { syncChatForNationFromUserList } from '~/api/chat';
import { guessRegionFromFollowers, guessRegionFromFollowings } from './nation';

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

