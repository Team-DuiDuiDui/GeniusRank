import { Avatar } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { user } from '~/utils/requests/ghapis/typings/user';
import InfoLink, { InfoIcon } from '../infoLink';
import { EnvironmentOutlined, ShopOutlined, XOutlined } from '@ant-design/icons';

interface userInfo {
    data: user;
}

const UserInfo: React.FC<userInfo> = ({ data }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col w-full bg-white p-8 rounded-lg 对">
            <div className="flex flex-row items-center justify-left gap-8 w-full">
                <Avatar src={data.avatar_url} size="xl" />
                <div className="flex flex-col">
                    <p className="text-2xl font-bold">{data.name ?? data.login}</p>
                    {data.name && <p className="text-sm text-gray-500">{data.login}</p>}
                    <p>{data.bio ?? <span className="text-gray-500"> {t('user.no_description')}</span>}</p>
                    <p className="text-sm">
                        {data.followers} {t('user.followers')} · {data.following} {t('user.following')}
                    </p>
                </div>
                <div className="ml-auto flex flex-col">
                    {data.location && <InfoIcon icon={<EnvironmentOutlined />}>{data.location}</InfoIcon>}
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
