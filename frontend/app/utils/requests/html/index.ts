// import { AxiosInstance } from "axios"
// import { handleClientGithubReq } from "../request"

// export const getFollowersHTML = async (instance: AxiosInstance, username: string, page: number): Promise<string> => {
//     return (await handleClientGithubReq<string, string>(
//         async () => await instance.get(`https://github.com/${username}?tab=followers&page=${page}`),
//         async (res) => res,
//     ))!;
// }