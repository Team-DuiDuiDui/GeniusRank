// routes/lazy.$param.tsx
import { ActionFunctionArgs, json } from "@remix-run/node";
import {
    createInstanceForBe,
    createInstanceForDeepSeek,
} from "~/api/backend/instance";
import { createInstanceForGithub } from "~/api/github/instance";
import { lng, user } from "~/cookie";
import i18nServer from "~/modules/i18n.server";
import { guessRegion } from "~/utils/region/main";

export const action = async (
    { params, request, context }: ActionFunctionArgs,
) => {
    console.log("params", params);
    const formData = await request.formData();
    const cookieHeader = request.headers.get("Cookie");

    const cookie = (await user.parse(cookieHeader)) || {};
    const locale = (await lng.parse(cookieHeader)) as string;
    const t = await i18nServer.getFixedT(request);
    const userData = formData.get("userData")!;
    const dataFromBe = formData.get("dataFromBe")!;
    const githubInstance = createInstanceForGithub(
        cookie.access_token,
        "Team-Duiduidui: Genius Rank",
        "Bearer",
    );
    const beInstance = createInstanceForBe(
        context.cloudflare.env.BASE_URL,
        cookie.be_token,
    );
    const deepSeekInstance = createInstanceForDeepSeek(
        context.cloudflare.env.DEEPSEEK_API_KEY,
    );
    try {
        const JSONData = JSON.parse(userData as string);
        await guessRegion({
            locale,
            userData: {
                t,
                ...JSONData,
            },
            beInstance,
            githubInstance,
            deepSeekInstance,
            dataFromBe: JSON.parse(dataFromBe as string),
        });
    } catch (error) {
        return json({ error });
    }
    return json({});
};

export default function LazyRoute() {
    return <></>;
}
