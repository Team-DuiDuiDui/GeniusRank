import { json, LoaderFunctionArgs, redirect, type MetaFunction } from '@remix-run/cloudflare';
import i18nServer from '~/modules/i18n.server';
import { Outlet, useLocation } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';
import LoadingLayout from '~/components/loading';

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
    useEffect(() => {
        parentRef.current && autoAnimate(parentRef.current);
    }, [parentRef, pathname]);
    return (
        <>
            <div className="flex h-screen flex-col items-center gap-14 relative" ref={parentRef}>
                <LoadingLayout />
                <Outlet />
            </div>
        </>
    );
}
