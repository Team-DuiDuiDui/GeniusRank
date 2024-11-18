import { handleRequest } from "~/utils/request";
import { AxiosInstanceForBe } from "./instance";
// import { NationData } from "./chat";

export interface NationData {
    login: string;
    nationISO: string;
    confidence: number;
    message: string;
    time: number;
}

export const getUserNation = async (login: string, instance: AxiosInstanceForBe): Promise<NationData | null> => {
    console.log('getUserNation', login)
    const result = await handleRequest<NationData | null>(
        () => instance.get(`/analyze/country/${login}`),
        async res => res.data.data ? { login: res.data.data.login, nationISO: res.data.data.country_iso, confidence: res.data.data.confidence, message: res.data.data.message, time: res.data.data.updateTime } : null,
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
    const body = { "country_iso": data.nationISO, "login": data.login, "message": data.message, "confidence": data.confidence }
    return handleRequest(
        () => instance.post(`/analyze/country`, body),
        async res => res.data.data,
        undefined, 0, false, false
    )
}