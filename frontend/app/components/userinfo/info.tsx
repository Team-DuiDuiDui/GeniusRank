import { Avatar } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { User } from '~/utils/requests/ghapis/typings/user';
import InfoLink, { InfoIcon } from '../infoLink';
import { EnvironmentOutlined, ShopOutlined, XOutlined } from '@ant-design/icons';

interface userInfo {
    data: User;
}

const UserInfo: React.FC<userInfo> = ({ data }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col w-full bg-white p-8 rounded-lg">
            <div className="flex flex-row items-center justify-left gap-8 w-full">
                <Avatar src={data.avatar_url} size="xl" radius={data.type !== 'User' ? 'sm' : undefined} />
                <div className="flex flex-col">
                    {/* data.login 是用户名，data.name 是用户昵称(可选) */}
                    <h2 className="text-2xl font-bold">
                        {data.name ?? data.login}
                        {data.type !== 'User' && (
                            <span className="ml-2 text-gray-400 text-xs font-normal">{t('user.not_a_user')}</span>
                        )}
                    </h2>
                    {data.name && <p className="text-sm text-gray-500">{data.login}</p>}
                    <p>{data.bio ?? <span className="text-gray-500"> {t('user.no_description')}</span>}</p>
                    <p className="text-sm">
                        {data.followers} {t('user.followers')} · {data.following} {t('user.following')}
                    </p>
                </div>
                <div className="ml-auto flex flex-col">
                    {data.location && (
                        <InfoIcon icon={<EnvironmentOutlined />}>
                            {data.location
                                .replaceAll('Taiwan', 'Taiwan, China')
                                .replaceAll('taiwan', 'Taiwan, China')
                                .replaceAll('台灣', '中国台湾')
                                .replaceAll('臺灣', '中国台湾')}
                        </InfoIcon>
                    )}
                    {data.company && (
                        <InfoIcon
                            href={
                                data.company.startsWith('@')
                                    ? `https://github.com/${data.company.split('@')[1]}`
                                    : undefined
                            }
                            icon={<ShopOutlined />}>
                            {data.company}
                        </InfoIcon>
                    )}
                    {data.blog && <InfoLink>{data.blog}</InfoLink>}
                    {data.twitter_username && (
                        <InfoIcon icon={<XOutlined />} href={`https://twitter.com/${data.twitter_username}`}>
                            {data.twitter_username}
                        </InfoIcon>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserInfo;
