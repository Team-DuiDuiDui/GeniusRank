import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { createInstanceForBe, createInstanceForDeepSeek } from "~/api/backend/instance";
import { createInstanceForGithub } from "~/api/github/instance";
import { user, lng } from "~/cookie";
import i18nServer from "~/modules/i18n.server";
import { guessRegion } from "~/utils/region/main";

export default async function action({ request, context }: ActionFunctionArgs) {
    const formData = await request.formData();
    console.log("通过 action 重新获取 nation 信息")
    const t = await i18nServer.getFixedT(request);
    const userData = JSON.parse(formData.get("userData") as string);
    const dataFromBe = JSON.parse(formData.get("dataFromBe") as string);
    const deepSeekInstance = createInstanceForDeepSeek(
        context.cloudflare.env.DEEPSEEK_API_KEY,
    );
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    const githubInstance = createInstanceForGithub(cookie.access_token, 'Team-Duiduidui: Genius Rank', 'Bearer');
    const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL, cookie.be_token);
    const locale = (await lng.parse(cookieHeader)) as string;
    const time = Date.now();
    try {
        const nationData = await guessRegion({
            locale,
            userData: {
                t,
                ...userData,
            },
            beInstance,
            githubInstance,
            deepSeekInstance,
            dataFromBe: dataFromBe,
            time
        });
        return json({ ...nationData, message: t(nationData.message), donotLoad: true });
    } catch {
        const nationData = {
            nationISO: '',
            nationName: '',
            message: t('user.info.from_followers_and_followings'),
            confidence: 0.5,
            login: userData.login,
        };
        return json({ ...nationData, donotLoad: true });
    }
}