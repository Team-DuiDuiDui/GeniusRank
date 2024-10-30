/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { LoaderFunctionArgs, json } from '@remix-run/cloudflare';
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useFetcher,
    useLoaderData,
    useNavigate,
    useRouteLoaderData,
} from '@remix-run/react';
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
import { user } from './user-cookie';

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
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const fetcher = useFetcher();
    const [opened, { open, close }] = useDisclosure(false);
    const [logOut, { toggle: toggleLogOut }] = useDisclosure();
    useChangeLanguage(locale);
    return (
        <>
            <ClientOnly>{() => <Toaster />}</ClientOnly>
            <ActionIcon variant="default" size="xl" className="z-40 m-10 absolute" onClick={open}>
                <MenuOutlined className="text-2xl text-gray-500" />
            </ActionIcon>
            <Drawer opened={opened} onClose={close}>
                <div className="flex flex-col gap-5 h-full">
                    <div className={`flex flex-row justify-center gap-5`}>
                        <Avatar size="lg" src={userAvatar ?? undefined} />
                        <div className="flex flex-col justify-center">
                            <p className="text-lg font-bold">{username ?? userLogin ?? t('drawer.anonymous')}</p>
                            {userLogin && <p className="text-sm text-gray-500">{userEmail ?? userLogin}</p>}
                        </div>
                    </div>
                    <SegmentedControl
                        className="mt-auto"
                        defaultValue={i18n.language}
                        onChange={(value) => {
                            fetcher.submit({ lng: value }, { method: 'get' });
                            i18n.changeLanguage(value);
                        }}
                        data={[
                            {
                                label: '中文',
                                value: 'zh',
                            },
                            {
                                label: 'English',
                                value: 'en',
                            },
                        ]}
                    />
                    <Divider label={userLogin ? t('drawer.logout') : t('drawer.login')} labelPosition="center" />
                    {userLogin ? (
                        <Button
                            variant="filled"
                            color="red"
                            type="submit"
                            loading={logOut}
                            onClick={async () => {
                                toggleLogOut();
                                await fetch('/logout', { method: 'post' });
                                navigate('.', { replace: true });
                            }}>
                            {t('drawer.logout')}
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            component="a"
                            href={`https://github.com/login/oauth/authorize/?client_id=${client_id}&scope=user:email,read:user`}>
                            <div className="flex gap-2 items-center justify-center text-base">
                                <GithubFilled />
                                {t('drawer.login_github')}
                            </div>
                        </Button>
                    )}
                </div>
            </Drawer>
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
