import { json, LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import axios from 'axios';
import { ZodError } from 'zod';
import i18nServer from '~/modules/i18n.server';
import { githubUser } from '~/utils/requests/github/user';

export async function loader({ request, params }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    if (params.name) {
        const user = new githubUser(params.name);
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
                if (e.status === 404) throw new Response(t('user.err.not_found'), { status: 404 });
                else throw new Response(t('user.err.error'), { status: 500 });
            } else if (e instanceof ZodError) throw new Response(t('user.err.parse_error'), { status: 500 });
            else throw new Response(t('user.err.something_wrong'), { status: 500 });
        }
    }
    return redirect('/');
}
