import { Form, Link, useFetcher } from '@remix-run/react';
import { ActionIcon, Avatar, Button } from '@mantine/core';
import geniusRank from '~/assets/geniusRank.svg';
import octoCat from '~/assets/github.svg';
import MenuIcon from './menu';
import Search from './search';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
    openDrawer: () => void;
    userAvatar: string;
}

const Header: React.FC<HeaderProps> = ({ openDrawer, userAvatar }) => {
    const { t, i18n } = useTranslation();
    const fetcher = useFetcher();
    return (
        <div className="flex items-center justify-between py-6 px-8">
            <div className="flex items-center gap-4 w-1/6">
                <ActionIcon variant="default" size="xl" onClick={openDrawer}>
                    <MenuIcon />
                </ActionIcon>
                <Link to="/" className="hover:scale-105 active:scale-95 transition-all lg:block hidden">
                    <img src={geniusRank} alt="logo" className="h-10" />
                </Link>
            </div>
            <div className="w-3/5 lg:w-1/3">
                <Search logo={octoCat} placeholder={t('search.placeholder')} />
            </div>
            <div className="w-1/6 flex justify-end gap-4 items-center">
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
                <button onClick={openDrawer}>
                    <Avatar size="md" src={userAvatar ?? undefined} />
                </button>
            </div>
        </div>
    );
};

export default Header;
