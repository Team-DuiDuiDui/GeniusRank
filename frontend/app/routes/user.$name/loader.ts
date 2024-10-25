import { json, LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import i18nServer from '~/modules/i18n.server';
import { githubUser } from '~/utils/requests/github/user';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    if (params.name) {
        const user = new githubUser(params.name);
        const data = await user.getUser();
        return json({
            userData: data,
            title: `${params?.name ?? ''} | Genius Rank`,
            description: t('user.description'),
        });
    }
    return redirect('/');
}
