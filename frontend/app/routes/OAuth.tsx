import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button } from '@mantine/core';
import { json, LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { z, ZodError } from 'zod';
import i18nServer from '~/modules/i18n.server';
import { user } from '~/user-cookie';

export async function loader({ request, context }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    if (cookie.access_token) return redirect('/');
    if (code) {
        try {
            const res = await axios.post(
                `https://github.com/login/oauth/access_token`,
                {
                    client_id: context.cloudflare.env.GITHUB_CLIENT_ID,
                    client_secret: context.cloudflare.env.GITHUB_CLIENT_SECRET,
                    code: code,
                },
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );
            //如果 res 里面 有 error 字段
            if (res.data.error) {
                return json(
                    {
                        error: {
                            message: t('oauth.err.bad_verification_code_title'),
                            title: t('oauth.err.bad_verification_code'),
                        },
                        title: `${t('oauth.err.error')} | Genius Rank`,
                        description: t('user.description'),
                        client_id: context.cloudflare.env.GITHUB_CLIENT_ID,
                    },
                    { status: 400 }
                );
            }
            const oauthSchema = z.object({
                access_token: z.string(),
                scope: z.literal('user:email,read:user').or(z.literal('read:user,user:email')),
                token_type: z.string(),
            });
            const data = oauthSchema.parse(res.data);
            const { access_token, token_type } = data;
            const userData = await axios.get(`https://api.github.com/user`, {
                headers: {
                    Authorization: `${token_type} ${access_token}`,
                },
            });
            cookie.userAvatar = userData.data.avatar_url;
            cookie.username = userData.data.name;
            cookie.userLogin = userData.data.login;
            cookie.userEmail = userData.data.email;
            cookie.access_token = access_token;
            return redirect('/', {
                headers: {
                    'Set-Cookie': await user.serialize(cookie, {
                        secure: true,
                        httpOnly: true,
                        maxAge: 60 * 60 * 24,
                        sameSite: 'lax',
                    }),
                },
            });
        } catch (e) {
            if (axios.isAxiosError(e)) {
                if (e.response?.status && e.response.status >= 400 && e.response.status < 500)
                    return json(
                        {
                            error: {
                                message: t('oauth.err.bad_verification_code_title'),
                                title: t('oauth.err.bad_verification_code'),
                            },
                            title: `${t('oauth.err.error')} | Genius Rank`,
                            description: t('user.description'),
                            client_id: context.cloudflare.env.GITHUB_CLIENT_ID,
                        },
                        { status: e.response?.status }
                    );
                return json(
                    {
                        error: {
                            message: t('oauth.err.network_error'),
                            title: t('oauth.err.network_error'),
                        },
                        title: `${t('oauth.err.error')} | Genius Rank`,
                        description: t('user.description'),
                        client_id: context.cloudflare.env.GITHUB_CLIENT_ID,
                    },
                    { status: 500 }
                );
            }
            if (e instanceof ZodError) {
                return json(
                    {
                        error: {
                            message: t('oauth.err.invalid_scope'),
                            title: t('oauth.err.invalid_scope_title'),
                        },
                        title: `${t('oauth.err.error')} | Genius Rank`,
                        description: t('user.description'),
                        client_id: context.cloudflare.env.GITHUB_CLIENT_ID,
                    },
                    { status: 400 }
                );
            }
            return json(
                {
                    error: {
                        message: t('oauth.err.unknown_error'),
                        title: t('oauth.err.unknown_error'),
                    },
                    title: `${t('oauth.err.error')} | Genius Rank`,
                    description: t('user.description'),
                    client_id: context.cloudflare.env.GITHUB_CLIENT_ID,
                },
                { status: 500 }
            );
        }
    } else {
        return redirect('/');
    }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};
export default function OAuth() {
    const { error, client_id } = useLoaderData<typeof loader>();
    const { t } = useTranslation();
    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col gap-6">
            <ExclamationCircleTwoTone twoToneColor={'#ff4d4f'} className="text-6xl" />
            <div className="flex flex-col justify-center items-center gap-2">
                <h1 className="text-2xl">{t('oauth.err.error')}</h1>{' '}
                <p className="text-sm text-gray-500">
                    {error.title}: {error.message}
                </p>
            </div>
            <div className="flex gap-4">
                <Button
                    component="a"
                    href={`https://github.com/login/oauth/authorize/?client_id=${client_id}&scope=user:email,read:user`}>
                    <div className="flex gap-2 items-center justify-center text-base">{t('oauth.err.re-login')}</div>
                </Button>
                <Link to="/">
                    <Button variant="default">
                        <div className="flex gap-2 items-center justify-center text-base">{t('oauth.err.back')}</div>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
