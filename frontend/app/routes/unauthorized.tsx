import { ExclamationCircleTwoTone } from '@ant-design/icons';
import { Button } from '@mantine/core';
import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import i18nServer from '~/modules/i18n.server';

export async function loader({ request, context }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    return json(
        {
            error: {
                title: t('auth.err.unauthorized_title'),
                message: t('auth.err.unauthorized'),
            },
            title: `${t('auth.err.unauthorized_title')} | Genius Rank`,
            description: t('user.description'),
            client_id: context.cloudflare.env.GITHUB_CLIENT_ID,
        },
        { status: 400 }
    );
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};
export default function Unauthorized() {
    const { client_id, error } = useLoaderData<typeof loader>();
    const { t } = useTranslation();
    return (
        <div className="h-screen w-screen flex justify-center items-center flex-col gap-6">
            <ExclamationCircleTwoTone twoToneColor={'#ff4d4f'} className="text-6xl" />
            <div className="flex flex-col justify-center items-center gap-2">
                <h1 className="text-2xl">{t('auth.err.unauthorized_title')}</h1>
                <p className="text-sm text-gray-500">
                    {error.title}: {error.message}
                </p>
            </div>
            <div className="flex gap-4">
                <Button
                    component="a"
                    href={`https://github.com/login/oauth/authorize/?client_id=${client_id}&scope=user:email,read:user`}>
                    <div className="flex gap-2 items-center justify-center text-base">{t('auth.err.login')}</div>
                </Button>
                <Link to="/">
                    <Button variant="default">
                        <div className="flex gap-2 items-center justify-center text-base">{t('auth.err.back')}</div>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
