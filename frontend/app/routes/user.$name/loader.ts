import { json, LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import axios from 'axios';
import { ZodError } from 'zod';
import i18nServer from '~/modules/i18n.server';
import { GithubUserServerOnly } from '~/utils/requests/ghapis/user.server';

export async function loader({ request, params, context }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    if (params.name) {
        const user = new GithubUserServerOnly(params.name, context.cloudflare.env.GITHUB_ACCESS_TOKEN);
        try {
            const data = await user.getUser();
            return json({
                userData: data,
                title: `${params?.name ?? ''} | Genius Rank`,
                description: t('user.description'),
            });
        } catch (e) {
            // eslint-disable-next-line import/no-named-as-default-member
            if (axios.isAxiosError(e)) {
                console.log(e);
                if (e.status === 404) throw new Response(t('user.err.not_found'), { status: 404 });
                if (e.status === 403) throw new Response(t('user.err.rate_limit'), { status: 403 });
                else throw new Response(t('user.err.something_wrong'), { status: 500 });
            } else if (e instanceof ZodError) throw new Response(t('user.err.parse_error'), { status: 500 });
            else throw new Response(t('user.err.something_wrong'), { status: 500 });
        }
    }
    return redirect('/');
}
