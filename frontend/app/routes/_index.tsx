import { Button } from '@mantine/core';
import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { useTranslation } from 'react-i18next';
import i18nServer from '~/modules/i18n.server';
export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title }, { name: 'description', content: data?.description }];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    return json({ title: t('title'), description: t('user.description') });
}

export default function Index() {
    const { t } = useTranslation();
    return (
        <>
            <div className="px-8 py-12 bg-blue-400/70 text-white flex flex-col justify-center items-center gap-2">
                <h1 className="text-6xl font-bold">Genius Rank</h1>
                <h2 className="text-2xl">{t('description')}</h2>
                <Button variant="default" size="md" className="mt-4">
                    {t('lookup_docs')}
                </Button>
            </div>
        </>
    );
}
