import { json, LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import axios from 'axios';
import { createInstanceForBe } from '~/api/instance';
import i18nServer from '~/modules/i18n.server';
import { lng, user } from '~/cookie';
import { guessRegion } from '~/utils/region/main';
import { gqlUser } from '~/utils/requests/ghGraphql/gqlUser.server';
import { createInstanceForGithub } from '~/utils/requests/instance';

export async function loader({ request, params, context }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    const locale = (await lng.parse(cookieHeader)) as string;
    if (!cookie.access_token) return redirect('/unauthorized');
    const t = await i18nServer.getFixedT(request);
    if (params.name) {
        try {
            const user = new gqlUser(
                params.name,
                cookie.access_token,
                context.cloudflare.env.BASE_URL,
                cookie.be_token
            );
            const githubInstance = createInstanceForGithub(cookie.access_token);
            const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL, cookie.be_token);

            const { data } = await user.getData();
            if (!data.user) throw new Response(t('user.err.not_found'), { status: 404 });
            const nationData = await guessRegion({
                t,
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
            console.log(nationData);
            const scores = await user.getUserScores();
            return json({
                data,
                title: `${params?.name ?? ''} | Genius Rank`,
                description: t('user.description'),
                beToken: cookie.be_token,
                githubToken: cookie.access_token,
                nationData,
                scores,
            });
        } catch (e) {
            // eslint-disable-next-line import/no-named-as-default-member
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
