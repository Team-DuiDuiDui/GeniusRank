import { ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { createInstanceForBe } from "~/api/backend/instance";
import { UserDetail } from "~/api/github/graphql/typings/user";
import { createInstanceForGithub } from "~/api/github/instance";
import { user, lng } from "~/cookie";
import i18nServer from "~/modules/i18n.server";
import { guessRegion } from "~/utils/region/main";

export default async function action({ request, context }: ActionFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    const githubInstance = createInstanceForGithub(cookie.access_token, 'Team-Duiduidui: Genius Rank', 'Bearer');
    const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL, cookie.be_token);
    const t = await i18nServer.getFixedT(request);
    const body = await request.formData();
    const stringUserData = body.get('userData')?.toString();
    const locale = (await lng.parse(cookieHeader)) as string;
    if (body.get('reload-nation') === 'reload' && stringUserData) {
        const userData = JSON.parse(stringUserData) as Pick<UserDetail, 'followers' | 'following' | 'login' | 'location'>;
        try {
            const nationData = await guessRegion({
                locale,
                userData: {
                    t,
                    location: userData.location as string | undefined,
                    followers: userData.followers.totalCount,
                    followings: userData.following.totalCount,
                    login: userData.login,
                },
                beInstance,
                githubInstance,
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
    const nationData = {
        nationISO: '',
        nationName: '',
        message: t('user.info.from_followers_and_followings'),
        confidence: 0.5,
        login: 'unknown',
    };
    return json({ ...nationData, donotLoad: true });
}