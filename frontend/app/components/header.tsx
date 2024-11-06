import { Form, Link, useFetcher, useLocation } from '@remix-run/react';
import { ActionIcon, Avatar, Button } from '@mantine/core';
import geniusRank from '~/assets/geniusRank.svg';
import octoCat from '~/assets/github.svg';
import MenuIcon from './menu';
import Search from './search';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';
import scaleAnimate from '~/utils/auto-animate-plugin/scale';

interface HeaderProps {
    openDrawer: () => void;
    userData: {
        avatar: string;
        login: string;
        name: string;
    };
}

const Header: React.FC<HeaderProps> = ({ openDrawer, userData }) => {
    const { t, i18n } = useTranslation();
    const fetcher = useFetcher();
    const params = useLocation();
    const parentRef = useRef(null);
    useEffect(() => {
        parentRef.current && autoAnimate(parentRef.current, scaleAnimate);
    }, [parentRef, params.pathname]);
    return (
        <div className="flex items-center justify-between py-3 px-8 shadow-lg sticky top-0 bg-white z-40">
            <div className="flex items-center gap-4 w-1/3">
                <ActionIcon variant="default" size="xl" onClick={openDrawer}>
                    <MenuIcon />
                </ActionIcon>
                <Link to="/" className="hover:scale-105 active:scale-95 transition-all lg:block hidden">
                    <img src={geniusRank} alt="logo" className="h-10" />
                </Link>
                <div className="flex items-center gap-6 justify-evenly h-full">
                    <Link
                        to="/user"
                        className={`text-nowrap transition-all py-1 px-2 rounded-lg ${
                            params.pathname.startsWith('/user') || params.pathname.startsWith('/detail')
                                ? 'text-gray-500'
                                : 'hover:text-gray-700 hover:bg-gray-200'
                        }`}>
                        <span className="text-lg">用户</span>
                    </Link>
                    <Link
                        to="/ranking"
                        className={`text-nowrap transition-all py-1 px-2 rounded-lg ${
                            params.pathname.startsWith('/ranking')
                                ? 'text-gray-500'
                                : 'hover:text-gray-700 hover:bg-gray-200'
                        }`}>
                        <span className="text-lg">排名</span>
                    </Link>
                </div>
            </div>
            <div className="w-2/4 lg:w-1/3" ref={parentRef}>
                {params.pathname !== '/detail' && params.pathname !== '/user' && (
                    <Search logo={octoCat} placeholder={t('search.placeholder')} />
                )}
            </div>
            <div className="w-1/3 flex justify-end gap-4 items-center">
                {/* 下面这么写的好处是无论 JS 是否禁用都能获得最好体验 */}
                <Form
                    className="lg:block hidden"
                    action="#"
                    onClick={(e) => {
                        e.preventDefault();
                        fetcher.submit({ lng: t('opposite_lng') }, { method: 'get' });
                        i18n.changeLanguage(t('opposite_lng'));
                    }}>
                    <Button type="submit" name="lng" value="zh" variant="default" size="xs">
                        {t('opposite_lng_name')}
                    </Button>
                </Form>
                <div className="flex justify-center items-center gap-4">
                    <div className="flex flex-col items-end h-full">
                        <div className="text-md font-semibold">{userData.name || userData.login}</div>
                        {userData.name ? <div className="text-xs text-gray-950">{userData.login}</div> : <></>}
                    </div>
                    <button onClick={openDrawer}>
                        <Avatar size="md" className="scale-125" src={userData.avatar ?? undefined} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
