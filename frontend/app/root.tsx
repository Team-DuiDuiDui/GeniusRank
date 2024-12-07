/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { json, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteLoaderData } from '@remix-run/react';
import i18nServer, { localeCookie } from './modules/i18n.server';
import { useChangeLanguage } from 'remix-i18next/react';
import { Toaster } from 'react-hot-toast';
import { ColorSchemeScript, MantineProvider, useMantineColorScheme } from '@mantine/core';
import { ClientOnly } from 'remix-utils/client-only';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import './tailwind.css';
import { useDisclosure } from '@mantine/hooks';
import { prefs, user } from './cookie';
import SettingDrawer from './components/drawer';
import Header from './components/header';
import { useEffect } from 'react';
import Footer from './components/footer';

export const handle = { i18n: ['translation'] };

export function Layout({ children }: { children: React.ReactNode }) {
    const loaderData = useRouteLoaderData<typeof loader>('root');
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Genius Rank',
        url: 'https://geniusrank.heuluck.top/',
        description: 'GitHub 用户数据查看、分析、国籍猜测与信息卡片展示',
        author: {
            '@type': 'Organization',
            name: 'Team-DuiDuiDui',
        },
    };

    return (
        <html
            lang={loaderData?.locale ?? 'en'}
            className={loaderData?.prefersColorScheme ?? 'light'}
            data-mantine-color-scheme={loaderData?.prefersColorScheme ?? 'light'}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
                <ColorSchemeScript />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </head>
            <body className="relative">
                <MantineProvider defaultColorScheme={loaderData?.prefersColorScheme ?? 'light'}>
                    {children}
                </MantineProvider>
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    const loaderData = useLoaderData<typeof loader>();
    const { locale, client_id, userAvatar, userLogin, username, userEmail } = loaderData;
    const [drawerOpened, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
    const { toggleColorScheme } = useMantineColorScheme();
    useChangeLanguage(locale);
    useEffect(() => {
        if (
            localStorage.getItem('mantine-color-scheme-value') &&
            localStorage.getItem('mantine-color-scheme-value') !== (loaderData?.prefersColorScheme ?? 'light')
        ) {
            toggleColorScheme();
        }
        localStorage.setItem('mantine-color-scheme-value', loaderData?.prefersColorScheme ?? 'light');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loaderData?.prefersColorScheme]);
    return (
        <>
            <ClientOnly>{() => <Toaster />}</ClientOnly>
            <Header
                openDrawer={openDrawer}
                userData={{
                    avatar: userAvatar,
                    name: username,
                    login: userLogin,
                }}
                client_id={client_id}
            />
            <SettingDrawer
                opened={drawerOpened}
                close={closeDrawer}
                userLogin={userLogin}
                userEmail={userEmail}
                userAvatar={userAvatar}
                username={username}
                client_id={client_id}
            />
            <Outlet />
            <Footer />
        </>
    );
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    const locale = await i18nServer.getLocale(request);
    const cookieHeader = request.headers.get('Cookie');
    const preferences = (await prefs.parse(cookieHeader)) || {};
    const userCookie = (await user.parse(cookieHeader)) || {};
    return json(
        {
            locale,
            prefersColorScheme: preferences.theme,
            userAvatar: userCookie.userAvatar,
            username: userCookie.username,
            userLogin: userCookie.userLogin,
            userEmail: userCookie.userEmail,
            client_id: context.cloudflare.env.GITHUB_CLIENT_ID,
        },
        {
            headers: [
                [
                    'Set-Cookie',
                    await localeCookie.serialize(locale, {
                        maxAge: 60 * 60 * 24 * 7,
                    }),
                ],
                ['Set-Cookie', await prefs.serialize(preferences)],
            ],
        }
    );
}
