import { handleBackendReq } from "~/utils/requests/request";
import { AxiosInstanceForBe } from "./instance";
import { ScoreRankResp } from "./typings/beRes";

export const getRankings = (
    backEndInstance: AxiosInstanceForBe,
    nation: string | null,
    type: string | null,
    size: number
): Promise<ScoreRankResp[]> => {
    return handleBackendReq(
        () => backEndInstance.get('/analyze/score/rank', {
            params: {
                ...(nation && { nation }),
                ...(type && { type }),
                ...(size && { size }),
            },
        }),
        (res) => res.data.data
    );
}