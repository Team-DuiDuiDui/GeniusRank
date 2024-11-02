import { handleClientReq } from "~/utils/requests/request";
import { AxiosInstanceForBe } from "./instance";

/**
 * 调用后端 chat 接口（非流式传输形式），直接返回国家结果
 * @param data 传入 userList 用来判断国家
 * @param language 返回国家的语言
 * @returns 返回国家
 */
export const syncChatForNationFromUserList = (data: string, language: string, beInstance: AxiosInstanceForBe): Promise<string> => {
    const message = `${data}
    这里面的数据中既有国家，也有这个国家所属的地区。
    请你帮我从这里面搜索一下出现频率最高的国家是哪里。
    你的输出内容需要是如下 json 格式的文本，格式如下（[]中是需要你判断的内容）。**注意：你的回答需要且只需要包含下面格式的 json 内容即可，不要有任何多余内容**
    {
        "nationName": [国家的英文全称],
        "nationISO": [国家对应的 ISO 简写]
        "nation": [${language} 对应语言下的国家名称]
    }
    `
    return syncChat(message, beInstance)
}

/**
 * 调用后端 chat 接口（非流式传输形式），从 readme 直接判断国家结果
 * @param data 传入 readme 用来判断国家
 * @param language 返回国家的语言
 * @returns 返回国家
 */
export const syncChatForNationFromReadme = (data: string, language: string, beInstance: AxiosInstanceForBe): Promise<string> => {
    const message = `${data}
    这是一个 README 文件中的内容，里面可能包含了作者的国家信息。
    请你从这里面找寻作者明确声明了自己属于某个地区的信息，并且告诉我这个地区属于哪个国家。
    注意，一定要从作者明确声明的地区，不要猜测。如果作者未声明地区，在 nationName 字段中返回空字符串即可。
    你的输出内容需要是如下 json 格式的文本，格式如下（[]中是需要你判断的内容）。**注意：你的回答需要且只需要包含下面格式的 json 内容即可，不要有任何多余内容**
    {
        "nationName": [国家的英文全称],
        "nationISO": [国家对应的 ISO 简写]
        "nation": [${language} 对应语言下的国家名称]
    }
    `
    return syncChat(message, beInstance)
}

/**
 * 调用后端 chat 接口（非流式传输形式）
 * @param message 传入数据用的 message
 * @param beInstance 后端 axios 实例
 * @returns 返回的结果
 */
export const syncChat = async (message: string, beInstance: AxiosInstanceForBe): Promise<string> => {
    return await handleClientReq(
        ()=>beInstance.post('/analyze/chat/sync', {message}), 
        async res => res.data.data, 
        undefined, 0, true, false
    )
}