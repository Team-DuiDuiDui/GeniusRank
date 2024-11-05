import { AxiosInstance, AxiosResponse } from 'axios';
import { UserScoreRanking } from '~/api/typings/beRes';

export const getRankings = (
    backEndInstance: AxiosInstance,
    nation: string | null,
    type: string | null,
    size: number
): Promise<AxiosResponse<UserScoreRanking>> => {
    return backEndInstance.get('/analyze/score/rank', {
        params: {
            ...(nation && { nation }),
            ...(type && { type }),
            ...(size && { size }),
        },
    });
};
