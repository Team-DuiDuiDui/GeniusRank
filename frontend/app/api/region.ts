import { handleRequest } from "~/utils/requests/request";
import { AxiosInstanceForBe } from "./instance";
// import { NationData } from "./chat";

export interface NationData {
    login: string;
    nationISO: string;
    confidence: number;
    message: string;
}

export const getUserNation = async (login: string, instance: AxiosInstanceForBe): Promise<NationData | null> => {
    const result = await handleRequest<NationData | null>(
        () => instance.get(`/analyze/country/${login}`),
        async res => res.data.data ? {login: res.data.data.login, nationISO: res.data.data.country_iso, confidence: res.data.data.confidence, message: res.data.data.message} : null,
        undefined, 0, false, false
    );
    return result !== undefined ? result : null;
}

export const updateUserNation = async (data: {
    login: string,
    nationISO: string,
    message: string,
    confidence: number,
}, instance: AxiosInstanceForBe): Promise<NationData> => {
    return handleRequest(
        () => instance.post(`/analyze/country/${data.login}`, {"country_iso":data.nationISO, "login":data.login, "message":data.message, "confidence":data.confidence}),
        async res => res.data.data,
        undefined, 0, false, false
    )
}