import { json, LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import axios from 'axios';
import { createInstanceForBe } from '~/api/instance';
import { getBeToken } from '~/api/user';
import i18nServer from '~/modules/i18n.server';
import { user } from '~/user-cookie';
import { gqlUser } from '~/utils/requests/ghGraphql/gqlUser.server';

export async function loader({ request, params, context }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    if (!cookie.access_token) return redirect('/unauthorized');
    const t = await i18nServer.getFixedT(request);
    if (params.name) {
        try {
            const user = new gqlUser(params.name, cookie.access_token);
            const { data } = await user.getData();
            if (!data.user) throw new Response(t('user.err.not_found'), { status: 404 });
            return json({
                data,
                title: `${params?.name ?? ''} | Genius Rank`,
                description: t('user.description'),
                githubToken: cookie.access_token as string,
                beToken: await getBeToken(
                    { id: data.user.databaseId!.toString(), login: data.user.login },
                    cookie.access_token,
                    createInstanceForBe(context.cloudflare.env.BASE_URL, cookie.be_token)
                ),
            });
        } catch (e) {
            // eslint-disable-next-line import/no-named-as-default-member
            if (axios.isAxiosError(e)) {
                if (e.status === 404) throw new Response(t('user.err.not_found'), { status: 404 });
                if (e.status === 403) {
                    throw new Response(t('user.err.rate_limit'), { status: 403 });
                } else throw new Response(t('user.err.something_wrong'), { status: 500 });
            } else if (e instanceof Response) throw e;
            else throw new Response(t('user.err.something_wrong'), { status: 500 });
        }
    }
    return redirect('/');
}
