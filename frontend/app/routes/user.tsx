import { json, LoaderFunctionArgs, redirect, type MetaFunction } from '@remix-run/cloudflare';
import { useTranslation } from 'react-i18next';
import Search from '~/components/search';
import githubCat from '~/assets/github.svg';
import i18nServer from '~/modules/i18n.server';
import { Outlet, useLocation } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';

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
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const parentRef = useRef(null);
    useEffect(() => {
        parentRef.current && autoAnimate(parentRef.current);
    }, [parentRef, pathname]);
    return (
        <>
            <div
                className={`flex h-screen flex-col ${
                    pathname === '/user' || pathname === '/user/' ? 'justify-center' : ''
                } items-center gap-14`}
                ref={parentRef}>
                <div className="flex flex-row items-center gap-16 w-full justify-center">
                    <div className="w-1/3 pt-8">
                        <Search logo={githubCat} placeholder={t('search.placeholder')} />
                    </div>
                </div>
                <Outlet />
            </div>
        </>
    );
}
