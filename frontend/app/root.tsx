/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteLoaderData } from '@remix-run/react';
import i18nServer, { localeCookie } from './modules/i18n.server';
import { useChangeLanguage } from 'remix-i18next/react';
import { Toaster } from 'react-hot-toast';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ClientOnly } from 'remix-utils/client-only';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import './tailwind.css';
import { useDisclosure } from '@mantine/hooks';
import { user } from './cookie';
import SettingDrawer from './components/drawer';
import Header from './components/header';

export const handle = { i18n: ['translation'] };

export function Layout({ children }: { children: React.ReactNode }) {
    const loaderData = useRouteLoaderData<typeof loader>('root');

    return (
        <html lang={loaderData?.locale ?? 'en'}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider>{children}</MantineProvider>
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
    useChangeLanguage(locale);
    return (
        <>
            <ClientOnly>{() => <Toaster />}</ClientOnly>
            <Header openDrawer={openDrawer} userAvatar={userAvatar} />
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
        </>
    );
}

export async function loader({ request, context }: LoaderFunctionArgs) {
    const locale = await i18nServer.getLocale(request);
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    return json(
        {
            locale,
            userAvatar: cookie.userAvatar,
            username: cookie.username,
            userLogin: cookie.userLogin,
            userEmail: cookie.userEmail,
            client_id: context.cloudflare.env.GITHUB_CLIENT_ID,
        },
        { headers: { 'Set-Cookie': await localeCookie.serialize(locale) } }
    );
}
