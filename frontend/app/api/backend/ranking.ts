import { handleBackendReq } from '~/utils/request';
import { AxiosInstanceForBe } from './instance';
import { ScoreRankResp, SingleUserScoreRes } from './typings/beRes';
import { AxiosResponse } from 'axios';

export const getRankings = (
    backEndInstance: AxiosInstanceForBe,
    nation: string | null,
    type: string | null,
    size: number
): Promise<ScoreRankResp> => {
    return handleBackendReq(
        () =>
            backEndInstance.get('/analyze/score/rank', {
                params: {
                    ...(nation && { nation }),
                    ...(type && { type }),
                    ...(size && { size }),
                },
            }),
        (res) => res.data.data
    );
};

export const getRankingsByUser = (
    backEndInstance: AxiosInstanceForBe,
    login: string
): Promise<AxiosResponse<SingleUserScoreRes>> => {
    return backEndInstance.get(`/analyze/score/${login}`);
};
