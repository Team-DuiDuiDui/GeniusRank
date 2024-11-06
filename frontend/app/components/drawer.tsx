import { GithubFilled } from '@ant-design/icons';
import { Avatar, Button, Divider, Drawer, SegmentedControl } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useFetcher, useNavigate } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

interface DrawerProps {
    opened: boolean;
    close: () => void;
    userLogin?: string;
    userEmail?: string;
    userAvatar?: string;
    username?: string;
    client_id: string;
}

const SettingDrawer: React.FC<DrawerProps> = ({
    opened,
    close,
    userLogin,
    userEmail,
    userAvatar,
    username,
    client_id,
}) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [logOut, { toggle: toggleLogOut }] = useDisclosure();
    const fetcher = useFetcher();
    return (
        <Drawer opened={opened} onClose={close}>
            <div className="flex flex-col gap-5 h-full z-50">
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
    );
};

export default SettingDrawer;
