import { handleClientReq } from "~/utils/requests/request";
import { AxiosInstanceForBe } from "./instance";

export const syncChatForNation = async (data: string, language: string, beInstance: AxiosInstanceForBe) => {
    const message = `${data}
    这里面的数据中既有国家，也有这个国家所属的地区。
    请你帮我从这里面搜索一下出现频率最高的国家是哪里。
    你只需要用${language}回答这个国家的名字即可`
    return await handleClientReq(
        ()=>beInstance.post('/analyze/chat/sync', {message}), 
        async res => res.data.data, 
        undefined, 0, true, false
    )
}