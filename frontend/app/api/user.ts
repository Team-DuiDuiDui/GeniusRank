import { handleRequest } from "~/utils/requests/request";
import { AxiosInstanceForBe } from "./instance";

export const getBeToken = async (userData: {id: string, login: string}, accessToken: string, instance: AxiosInstanceForBe): Promise<string> => {
    return (await handleRequest<string>(
        () => instance.post("/user/loginByOAuth", {githubUserId: userData.id, login: userData.login, accessToken: accessToken}),
        (res) => res.data.data.token,
    ))!;
}