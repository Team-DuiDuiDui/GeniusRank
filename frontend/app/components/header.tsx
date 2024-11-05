import { Form, Link, useFetcher } from '@remix-run/react';
import { ActionIcon, Avatar, Button } from '@mantine/core';
import geniusRank from '~/assets/geniusRank.svg';
import octoCat from '~/assets/github.svg';
import MenuIcon from './menu';
import Search from './search';
import { useTranslation } from 'react-i18next';

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
    return (
        <div className="flex items-center justify-between py-3 px-8 shadow-lg sticky">
            <div className="flex items-center gap-4 w-1/3">
                <ActionIcon variant="default" size="xl" onClick={openDrawer}>
                    <MenuIcon />
                </ActionIcon>
                <Link to="/" className="hover:scale-105 active:scale-95 transition-all lg:block hidden">
                    <img src={geniusRank} alt="logo" className="h-10" />
                </Link>
                <div className="flex items-center justify-between gap-12 ml-12">
                    <Link to="/user" >
                        <span className="text-lg">用户</span>
                    </Link>
                    <Link to="/ranking">
                        <span className="text-lg">排名</span>
                    </Link>
                </div>
            </div>
            <div className="w-2/4 lg:w-1/3 ">
                <Search logo={octoCat} placeholder={t('search.placeholder')} />
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
