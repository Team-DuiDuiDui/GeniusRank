import { json, LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import i18nServer from '~/modules/i18n.server';
import { user } from '~/user-cookie';
import { gqlUser } from '~/utils/requests/ghGraphql/gqlUser.server';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    if (!cookie.access_token) return redirect('/unauthorized');
    const t = await i18nServer.getFixedT(request);
    if (params.name) {
        const user = new gqlUser(params.name, cookie.access_token);
        const { data } = await user.getData();
        return json({
            data,
            title: `${params?.name ?? ''} | Genius Rank`,
            description: t('user.description'),
        });
    }
    return redirect('/');
}
