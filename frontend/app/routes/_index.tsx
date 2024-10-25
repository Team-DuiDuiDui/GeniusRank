import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import SearchCurtain from '~/components/searchCurtain';
import i18nServer from '~/modules/i18n.server';
export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title }, { name: 'description', content: data?.description }];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    return json({ title: t('title'), description: t('user.description') });
}

export default function Index() {
    return (
        <>
            <SearchCurtain />
            <div className="flex h-screen items-center justify-center overflow-auto">
                <div className="flex flex-row items-center gap-16 w-full justify-center">
                    <div className="w-1/2"></div>
                </div>
            </div>
        </>
    );
}
