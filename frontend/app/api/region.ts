import { handleRequest } from "~/utils/requests/request";
import { AxiosInstanceForBe } from "./instance";
import { NationData } from "./chat";

export const getUserNation = async (userId: string, instance: AxiosInstanceForBe): Promise<NationData> => {
    return handleRequest(
        () => instance.get(`/analyze/country/${userId}`),
        async res => res.data.data,
        undefined, 0, false, false
    )
}

export const updateUserNation = async (userId: string, country: string, instance: AxiosInstanceForBe): Promise<NationData> => {
    return handleRequest(
        () => instance.post(`/analyze/country/${userId}`, {"country":country, "githubUserId":userId}),
        async res => res.data.data,
        undefined, 0, false, false
    )
}