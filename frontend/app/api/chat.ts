import { handleClientReq } from "~/utils/requests/request";
import { AxiosInstanceForBe } from "./instance";

/**
 * 调用后端 chat 接口（非流式传输形式），直接返回国家结果
 * @param data 传入数据用来判断国家
 * @param language 返回国家的语言
 * @returns 返回国家
 */
export const syncChatForNation = async (data: string, language: string, beInstance: AxiosInstanceForBe): Promise<string> => {
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