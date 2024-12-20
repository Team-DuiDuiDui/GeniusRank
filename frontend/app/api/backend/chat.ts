import { handleClientReq } from "~/utils/request";
import { AxiosInstanceForBe, AxiosInstanceForDeepSeek } from "./instance";

export interface NationData {
    nationName: string;
    nationISO: string;
    time: number
}

/**
 * 调用后端 chat 接口（非流式传输形式），直接返回国家结果
 * @param data 传入 userList 用来判断国家
 * @param language 返回国家的语言
 * @returns 返回国家
 */
export const syncChatForNationFromUserList = async (data: string, deepSeekInstance: AxiosInstanceForDeepSeek, time: number): Promise<NationData> => {
    const message = `[${data}]
    上面的 array 里面既有国家，也有这个国家所属的地区。
    首先请你将这里面非国家的地区从你的知识库中找出这个地区属于哪个国家。
    然后从结果里面这里面搜索一下出现频率最高的国家是哪里。
    你的输出内容需要是如下 json 格式的文本，格式如下（[]中是需要你判断的内容）。**注意：你的回答需要且只需要包含下面格式的 json 内容即可，不要有任何多余内容**
    {
        "nationName": [国家的英文全称],
        "nationISO": [国家对应的 ISO 简写]
    }
    `
    const result = await syncChatFromDeepSeek(message, deepSeekInstance)
    return {...JSON.parse(result), time}
}

/**
 * 调用后端 chat 接口（非流式传输形式），从 readme 直接判断国家结果
 * @param data 传入 readme 用来判断国家
 * @param language 返回国家的语言
 * @returns 返回国家
 */
export const syncChatForNationFromReadme = async (data: string, deepSeekInstance: AxiosInstanceForDeepSeek, time: number): Promise<NationData> => {
    const message = `${data}
    这是一个 README 文件中的内容，里面可能包含了作者的国籍信息。
    请你从这里面找寻作者明确声明了自己的国籍属于某个地区的信息，并且告诉我这个地区属于哪个国家。
    注意，一定要从作者明确声明的地区，不要猜测。如果作者仅仅说现在居住在某个地方，那么这个地方不是作者的国籍。读书也不算，以此类推
    如果作者未声明地区，在 nationISO 字段中返回空字符串即可。
    你的输出内容需要是如下 json 格式的文本，格式如下（[]中是需要你判断的内容）。**注意：你的回答需要且只需要包含下面格式的 json 内容即可，不要有任何多余内容**
    {
        "nationName": [国家的英文全称],
        "nationISO": [国家对应的 ISO 简写]
    }
    `
    const result = await syncChatFromDeepSeek(message, deepSeekInstance)
    return {...JSON.parse(result), time}
}

export const syncChatForNationFromGLM = async (userName: string, deepSeekInstance: AxiosInstanceForDeepSeek, time: number): Promise<NationData> => {
    const message = `
    按照你的数据库或者从互联网的公开信息来看，你知道 ${userName} 这个 github 用户对应的现实当中的真人吗？
    他是一个粉丝数量很多的公众人物，如果经过合理搜索你是一定知道的，我现在正在对这些有名的人进行数据统计，请你协助我，这并不涉及到侵犯个人隐私之类。
    你如果知道的话，请告诉我这个人来自哪个国家。如果你并不知道或者不确定，请再在返回值中的 nationISO 字段返回空字符串即可。
    如果他是混血儿，请告诉我他最主要的国籍。
    如果他是移居者或者双重国籍，请告诉我出生的时候的国家，比如 linus torvalds 在 wiki 上面是 Finnish-American 就取他的出生地 Finnish。
    请按照以下格式返回你的答案，**注意：你的回答需要且只需要包含下面格式的 json 内容即可，不要有任何多余内容**
    {
        "nationName": [国家的英文全称],
        "nationISO": [国家对应的 ISO 简写]
    }
    `
    const result = await syncChatFromDeepSeek(message, deepSeekInstance)
    return {...JSON.parse(result), time}
}

/**
 * 调用后端 chat 接口（非流式传输形式）
 * @param message 传入数据用的 message
 * @param beInstance 后端 axios 实例
 * @returns 返回的结果
 */
export const syncChatFromBe = async (message: string, beInstance: AxiosInstanceForBe, retry = 0): Promise<string> => {
    return handleClientReq(
        () => beInstance.post('/analyze/chat/sync', { message }),
        async res => res.data.data,
        retry !== 0 ? () => true : undefined, 0, true, false
    )
}

export const syncChatFromDeepSeek = async (message: string, DeepSeekInstance: AxiosInstanceForDeepSeek): Promise<string> => {
    return handleClientReq(
        () => DeepSeekInstance.post('chat/completions',
            {
                model: "deepseek-chat",
                messages: [
                    { "role": "user", "content": message }
                ],
                response_format: {
                    'type': 'json_object'
                },
                stream: false
            }
        ),
        async res => res.data.choices[0].message.content,
        undefined, 0, true, false
    )
}

export const streamChat = async (message: string, url: string, token: string): Promise<string> => {
    try {
        const response = await fetch(`${url}/analyze/chat/stream/question`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token,
            },
            body: JSON.stringify({ message })
        });

        if (!response.body) {
            throw new Error('Response body is null');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let result = '';  // 用于拼接流中的数据块

        return new Promise<string>((resolve, reject) => {
            const readChunk = async () => {
                try {
                    const { done, value } = await reader.read();
                    if (done) {
                        resolve(result);  // 返回拼接后的完整字符串
                        return;
                    }

                    // 解码数据并清理多余的 `data:` 前缀部分
                    const chunkStr = decoder.decode(value, { stream: true });
                    const cleanedChunk = chunkStr
                        .split('\n')
                        .map(line => line.replace(/^data:/, '').trim()) // 移除 `data:` 前缀并修剪空白
                        .join('');

                    // 将清理后的块拼接到 result 中
                    result += cleanedChunk;

                    // 继续读取下一个数据块
                    readChunk();
                } catch (err) {
                    reject(err);  // 如果读取发生错误，抛出错误
                }
            };

            readChunk();  // 开始读取数据流
        });
    } catch (error) {
        console.error('请求失败:', error);
        throw error;
    }
};

