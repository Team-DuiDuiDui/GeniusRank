import { Form, Link, useFetcher, useLocation } from '@remix-run/react';
import { ActionIcon, Avatar, Button, useMantineColorScheme } from '@mantine/core';
import geniusRank from '~/assets/geniusRank.svg';
import geniusRankWhite from '~/assets/geniusRank_white.svg';
import octoCat from '~/assets/github.svg';
import octoCatWhite from '~/assets/github_white.svg';
import MenuIcon from './menu';
import Search from './search';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';
import scaleAnimate from '~/utils/auto-animate-plugin/scale';
import { MoonOutlined, SunOutlined, TranslationOutlined } from '@ant-design/icons';

interface HeaderProps {
    client_id: string;
    openDrawer: () => void;
    userData: {
        avatar: string;
        login: string;
        name: string;
    };
}

const Header: React.FC<HeaderProps> = ({ client_id, openDrawer, userData }) => {
    const { t, i18n } = useTranslation();
    const fetcher = useFetcher();
    const params = useLocation();
    const { toggleColorScheme } = useMantineColorScheme();
    const parentRef = useRef(null);
    useEffect(() => {
        parentRef.current && autoAnimate(parentRef.current, scaleAnimate);
    }, [parentRef, params.pathname]);
    return (
        <div className="flex items-center justify-between py-3 px-3 sm:px-8 shadow-lg sticky top-0 bg-white dark:bg-slate-900 z-40 h-[68px]">
            <div className="flex items-center gap-4 w-1/6 md:w-1/3">
                <ActionIcon
                    variant="default"
                    className="bg-white dark:bg-slate-800 dark:border-blue-900 dark:hover:bg-slate-700 transition-all"
                    size="xl"
                    onClick={openDrawer}>
                    <MenuIcon />
                </ActionIcon>
                <Link to="/" className="hover:scale-105 active:scale-95 transition-all lg:block hidden">
                    <img src={geniusRank} alt="logo" className="h-10 dark:hidden" />
                    <img src={geniusRankWhite} alt="logo" className="h-10 hidden dark:block" />
                </Link>
                <div className="md:flex items-center gap-6 justify-evenly h-full hidden">
                    <Link
                        to="/user"
                        className={`text-nowrap transition-all py-1 px-2 rounded-lg ${
                            params.pathname.startsWith('/user') || params.pathname.startsWith('/detail')
                                ? 'text-gray-500 dark'
                                : 'hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-slate-700 dark:hover:text-gray-300 dark:text-gray-300'
                        }`}>
                        <span className="text-lg">{t('searching')}</span>
                    </Link>
                    <Link
                        to="/ranking"
                        className={`text-nowrap transition-all py-1 px-2 rounded-lg ${
                            params.pathname.startsWith('/ranking')
                                ? 'text-gray-500'
                                : 'hover:text-gray-700 hover:bg-gray-200 dark:hover:bg-slate-700 dark:hover:text-gray-300 dark:text-gray-300'
                        }`}>
                        <span className="text-lg">{t('ranking.title')}</span>
                    </Link>
                </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3" ref={parentRef}>
                {!params.pathname.startsWith('/detail') && !params.pathname.startsWith('/user') && (
                    <Search logoWhite={octoCatWhite} logo={octoCat} placeholder={t('search.placeholder')} />
                )}
            </div>
            <div className="w-0 sm:w-1/3 flex justify-end gap-4 items-center">
                {/* 下面这么写的好处是无论 JS 是否禁用都能获得最好体验 */}
                <Form
                    className="lg:block hidden"
                    action="#"
                    onClick={(e) => {
                        e.preventDefault();
                        fetcher.submit({ lng: t('opposite_lng') }, { method: 'get' });
                        i18n.changeLanguage(t('opposite_lng'));
                    }}>
                    <button
                        type="submit"
                        name="lng"
                        value={t('opposite_lng')}
                        className="py-1 px-2 hover:bg-gray-200 rounded-md dark:bg-slate-800 dark:border-blue-900 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-gray-300 transition-all aspect-square">
                        <TranslationOutlined className="text-base" />
                    </button>
                </Form>
                <Form
                    className="lg:block hidden"
                    action="/theme"
                    method="post"
                    onClick={(e) => {
                        e.preventDefault();
                        fetcher.submit({ doNotRedirect: true }, { method: 'post', action: '/theme' });
                        toggleColorScheme();
                    }}>
                    <button
                        type="submit"
                        className="p-2 hover:bg-gray-200 rounded-md dark:bg-slate-800 dark:border-blue-900 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-gray-300 transition-all">
                        <SunOutlined className="block dark:hidden" />
                        <MoonOutlined className="hidden dark:block" />
                    </button>
                </Form>
                <div className="flex justify-center items-center gap-4">
                    <div className="md:flex flex-col items-end h-full hidden">
                        <div className="text-md font-semibold dark:text-gray-200">
                            {userData.name || userData.login}
                        </div>
                        {userData.name ? (
                            <div className="text-xs text-gray-950 dark:text-gray-300">{userData.login}</div>
                        ) : (
                            <></>
                        )}
                    </div>
                    <Button
                        unstyled
                        component="a"
                        href={
                            userData.login
                                ? undefined
                                : `https://github.com/login/oauth/authorize/?client_id=${client_id}&scope=user:email,read:user`
                        }
                        onClick={(e) => {
                            e.preventDefault();
                            openDrawer();
                        }}
                        className="hidden sm:block">
                        <Avatar size="md" className="scale-125" src={userData.avatar ?? undefined} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Header;
