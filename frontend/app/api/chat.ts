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
    请你帮我从这里面搜索一下出现频率最高的国家是哪里，置信度的计算参考数据集的大小和国家出现的次数。
    你的输出结果中的所有内容需要完全遵循 json 语法，只需要按照这个 json 字符串的格式 {"nation": \${国家名}, "stablility": \${置信度}} 即可，我需要对你的回答直接 JSON.parse。
    需要用${language}这个缩写对应的语言转换国家名、置信度最大为 1 , 最小为 0 ,小于 0.5 会被认为无法判断`
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
    注意，一定要从作者明确声明的地区，不要猜测。
    你的输出结果只需要按照这个 json 字符串的格式 {"nation": \${国家名}, "stablility": \${置信度}} 即可，我需要对你的回答直接 JSON.parse。
    需要用${language}这个缩写对应的语言转换国家名、置信度最大为 1 , 最小为 0 ,小于 0.5 会被认为无法判断。
    如果作者未声明地区，请输出 {"nation": "Node 03", "stablility": 0}
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