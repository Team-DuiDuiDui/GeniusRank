import { handleBackendReq } from '~/utils/request';
import { AxiosInstanceForBe } from './instance';
import { GithubScoreRes, ScoreRankResp, SingleUserScoreRes } from './typings/beRes';
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

export const getUserRanking = (
    backEndInstance: AxiosInstanceForBe,
    login: string
): Promise<{ rank: number, score: number }> => {
    return handleBackendReq(
        () => backEndInstance.get(`/analyze/score/rank/${login}`),
        (res) => res.data.data
    );
}

export const getRankingsByUserWithHandle = (
    backEndInstance: AxiosInstanceForBe,
    login: string
): Promise<GithubScoreRes["data"]> => {
    return handleBackendReq(
        () => backEndInstance.get(`/analyze/score/${login}`),
        (res) => res.data.data
    );
}

/** 这里有特殊的错误处理 Handle */
export const getRankingsByUser = (
    backEndInstance: AxiosInstanceForBe,
    login: string
): Promise<AxiosResponse<SingleUserScoreRes>> => {
    return backEndInstance.get(`/analyze/score/${login}`);
};
