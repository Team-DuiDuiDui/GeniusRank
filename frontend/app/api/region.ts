import { handleRequest } from "~/utils/requests/request";
import { AxiosInstanceForBe } from "./instance";
import { NationData } from "./chat";

export const getUserNation = async (login: string, instance: AxiosInstanceForBe): Promise<{nationISO: string, nationName: string} | null> => {
    const result = await handleRequest<{nationISO: string, nationName: string} | null>(
        () => instance.get(`/analyze/country/${login}`),
        async res => res.data.data ? {nationISO: res.data.data.country_iso, nationName: res.data.data.country_name} : null,
        undefined, 0, false, false
    );
    return result !== undefined ? result : null;
}

export const updateUserNation = async (userId: string, country: string, instance: AxiosInstanceForBe): Promise<NationData> => {
    return handleRequest(
        () => instance.post(`/analyze/country/${userId}`, {"country":country, "githubUserId":userId}),
        async res => res.data.data,
        undefined, 0, false, false
    )
}