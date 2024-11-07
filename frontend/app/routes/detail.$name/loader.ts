import { LoaderFunctionArgs, redirect, json } from "@remix-run/cloudflare";
import axios, { AxiosError } from "axios";
import { createInstanceForBe } from "~/api/backend/instance";
import { gqlUser } from "~/api/github/graphql/gqlUser.server";
import { createInstanceForGithub } from "~/api/github/instance";
import { user, lng } from "~/cookie";
import i18nServer from "~/modules/i18n.server";
import { guessRegion } from "~/utils/region/main";

export default async function loader({ request, params, context }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    const locale = (await lng.parse(cookieHeader)) as string;
    if (!cookie.access_token) return redirect('/unauthorized');
    const t = await i18nServer.getFixedT(request);
    if (params.name) {
        try {
            const githubInstance = createInstanceForGithub(
                cookie.access_token,
                'Team-Duiduidui: Genius Rank',
                'Bearer'
            );
            const user = new gqlUser(
                params.name,
                cookie.access_token,
                context.cloudflare.env.BASE_URL,
                cookie.be_token,
                githubInstance
            );
            const { data } = await user.getData();
            if (!data.user) throw new Response(t('user.err.not_found'), { status: 404 });
            const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL, cookie.be_token);
            let nationData = {
                nationISO: '',
                message: t('user.info.from_followers_and_followings'),
                confidence: 0.5,
            };
            try {
                nationData = await guessRegion({
                    locale,
                    userData: {
                        t,
                        followers: data.user.followers.totalCount,
                        followings: data.user.following.totalCount,
                        login: data.user.login,
                    },
                    beInstance,
                    githubInstance,
                });
                nationData = {
                    ...nationData,
                    confidence: parseFloat(nationData.confidence.toFixed(2)),
                    message: t(nationData.message),
                };
            } catch {
                nationData = {
                    nationISO: '',
                    message: t('user.info.from_followers_and_followings'),
                    confidence: 0,
                };
            }
            try {
                const scores = await user.getUserScores();
                return json({
                    data,
                    title: `${params?.name ?? ''} | Genius Rank`,
                    description: t('user.description'),
                    beToken: cookie.be_token,
                    githubToken: cookie.access_token,
                    nationData,
                    scores,
                    scoresError: null,
                });
            } catch (e) {
                return json({
                    data,
                    title: `${params?.name ?? ''} | Genius Rank`,
                    description: t('user.description'),
                    beToken: cookie.be_token,
                    githubToken: cookie.access_token,
                    nationData,
                    scores: null,
                    scoresError: e as AxiosError,
                });
            }
        } catch (e) {
            console.log(e);
            if (axios.isAxiosError(e)) {
                if (e.status === 404) throw new Response(t('user.err.not_found'), { status: 404 });
                if (e.status === 403) {
                    throw new Response(t('user.err.rate_limit'), { status: 403 });
                } else throw new Response(t('user.err.something_wrong'), { status: 500 });
            } else if (e instanceof Response) throw e;
            else {
                console.log(e);
                throw new Response(t('user.err.something_wrong'), { status: 500 });
            }
        }
    }
    return redirect('/');
}