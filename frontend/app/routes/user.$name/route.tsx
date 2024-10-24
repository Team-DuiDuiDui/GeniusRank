import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import i18nServer from '~/modules/i18n.server';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title }, { name: 'description', content: data?.description }];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    return json({ title: `${params?.name ?? ''} | Genius Rank`, description: t('user.description') });
}

export default function Index() {
    return (
        <>
            <div className="flex h-screen items-center justify-center w-full">
                <div className="flex flex-row items-center gap-16 w-full justify-center"></div>
            </div>
        </>
    );
}
