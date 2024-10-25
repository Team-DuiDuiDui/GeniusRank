import { Avatar } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { user } from '~/utils/requests/github/typings/user';
import InfoLink from '../infoLink';

interface userInfo {
    data: user;
}

const UserInfo: React.FC<userInfo> = ({ data }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col w-full bg-white p-8 rounded-lg">
            <div className="flex flex-row items-center justify-left gap-8 w-full">
                <Avatar src={data.avatar_url} size="xl" />
                <div className="flex flex-col">
                    <p className="text-2xl font-bold">{data.name ?? data.login}</p>
                    {data.name && <p className="text-sm text-gray-500">{data.login}</p>}
                    <p>{data.bio ?? <span className="text-gray-500"> {t('user.no_description')}</span>}</p>
                </div>
                <div className="ml-auto flex flex-col">{data.blog && <InfoLink>{data.blog}</InfoLink>}</div>
            </div>
        </div>
    );
};

export default UserInfo;
