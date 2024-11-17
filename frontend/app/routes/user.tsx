import { json, LoaderFunctionArgs, redirect, type MetaFunction } from '@remix-run/cloudflare';
import i18nServer from '~/modules/i18n.server';
import { Outlet, useLocation } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';
import LoadingLayout from '~/components/loading';
import { useTranslation } from 'react-i18next';
import Search from '~/components/search';
import octoCat from '~/assets/github.svg';
import octoCatWhite from '~/assets/github_white.svg';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title }, { name: 'description', content: data?.description }];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    return json({ title: t('user.title'), description: t('user.description') });
}

export async function action({ request }: LoaderFunctionArgs) {
    const formData = await request.formData();
    const name = formData.get('name');
    /** 为了渐进增强 */
    return redirect(`/user/${name}`);
}

export default function Index() {
    const { pathname } = useLocation();
    const parentRef = useRef(null);
    const { t } = useTranslation();
    useEffect(() => {
        parentRef.current && autoAnimate(parentRef.current);
    }, [parentRef, pathname]);
    return (
        <>
            <div className="flex flex-col items-center gap-1 relative" ref={parentRef}>
                <LoadingLayout />
                <div className="px-8 py-12 bg-blue-400/70 dark:bg-slate-700 text-white flex flex-col justify-center items-center gap-2 w-full h-full">
                    <h1 className="text-6xl font-bold">Genius Rank</h1>
                    <h2 className="text-2xl">{t('description')}</h2>
                    <div className="w-full max-w-lg mt-12">
                        <Search logo={octoCat} logoWhite={octoCatWhite} placeholder={t('search.placeholder')} />
                    </div>
                </div>
                {pathname === '/user' ? <></> : <Outlet />}
            </div>
        </>
    );
}
