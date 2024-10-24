import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { useTranslation } from 'react-i18next';
import Search from '~/components/search';
import githubCat from '~/assets/github.svg';
import i18nServer from '~/modules/i18n.server';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title }, { name: 'description', content: data?.description }];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    return json({ title: t('user.title'), description: t('user.description') });
}

export default function Index() {
    const { t } = useTranslation();
    return (
        <>
            <div className="flex h-screen items-center justify-center">
                <div className="flex flex-row items-center gap-16 w-full justify-center">
                    <div className="w-1/3">
                        <Search logo={githubCat} placeholder={t('search.placeholder')} />
                    </div>
                </div>
            </div>
        </>
    );
}
