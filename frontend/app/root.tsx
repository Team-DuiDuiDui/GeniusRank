/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData, useRouteLoaderData } from '@remix-run/react';
import i18nServer, { localeCookie } from './modules/i18n.server';
import { useChangeLanguage } from 'remix-i18next/react';
import { Toaster } from 'react-hot-toast';
import {
    ActionIcon,
    Avatar,
    Button,
    ColorSchemeScript,
    Divider,
    Drawer,
    MantineProvider,
    SegmentedControl,
} from '@mantine/core';
import { ClientOnly } from 'remix-utils/client-only';
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import './tailwind.css';
import { GithubFilled, MenuOutlined } from '@ant-design/icons';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

export const handle = { i18n: ['translation'] };

export async function loader({ request }: LoaderFunctionArgs) {
    const locale = await i18nServer.getLocale(request);
    return json({ locale }, { headers: { 'Set-Cookie': await localeCookie.serialize(locale) } });
}

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
    const { locale } = useLoaderData<typeof loader>();
    const { t, i18n } = useTranslation();
    const [opened, { open, close }] = useDisclosure(false);
    useChangeLanguage(locale);
    return (
        <>
            <ClientOnly>{() => <Toaster />}</ClientOnly>
            <ActionIcon variant="default" size="xl" className="z-40 m-10 absolute" onClick={open}>
                <MenuOutlined className="text-2xl text-gray-500" />
            </ActionIcon>
            <Drawer opened={opened} onClose={close}>
                <div className="flex flex-col gap-5 h-full">
                    <div className="flex flex-row justify-center gap-10">
                        <Avatar size="lg" />
                        <div className="flex flex-col gap-1">
                            <p className="text-lg font-bold">John Doe</p>
                            <p className="text-sm text-gray-500">john.doe@example.com</p>
                        </div>
                    </div>
                    <SegmentedControl
                        className="mt-auto"
                        data={[
                            {
                                label: (
                                    <div
                                        onClick={() => {
                                            fetch('?lng=zh-CN');
                                            i18n.changeLanguage('zh-CN');
                                        }}>
                                        中文
                                    </div>
                                ),
                                value: 'zh-CN',
                            },
                            {
                                label: (
                                    <div
                                        onClick={() => {
                                            fetch('?lng=en');
                                            i18n.changeLanguage('en');
                                        }}>
                                        English
                                    </div>
                                ),
                                value: 'en',
                            },
                        ]}
                    />
                    <Divider label={t('drawer.login')} labelPosition="center" />
                    <Button variant="default">
                        <div className="flex gap-1 items-center justify-center text-base">
                            <GithubFilled />
                            {t('drawer.login_github')}
                        </div>
                    </Button>
                </div>
            </Drawer>
            <Outlet />
        </>
    );
}
