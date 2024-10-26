import { useTranslation } from 'react-i18next';
import { MinimalRepository, User, UserRepos } from '~/utils/requests/ghapis/typings/user';
import { Loader, Skeleton, Tooltip } from '@mantine/core';
import { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ForkOutlined } from '@ant-design/icons';

interface userRepositoriesProps {
    data: UserRepos | null;
    userData: User;
}

const UserRepositories: React.FC<userRepositoriesProps> = ({ data, userData }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    useEffect(() => {
        titleRef.current && autoAnimate(titleRef.current);
    }, [titleRef]);
    return (
        <div className="flex flex-col w-full bg-white p-8 pt-0 rounded-lg gap-4 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-bold sticky top-0 mt-4 bg-white py-1">
                {t('user.userRepos')}
                <span className="font-normal ml-4 text-base" ref={titleRef}>
                    {!data ? <Loader size="xs" /> : `${data?.length ?? '_'} / ${userData.public_repos ?? '_'}`}
                </span>
            </h2>
            {data ? (
                <>
                    <table className="w-full">
                        <thead>
                            <tr className="mb-6">
                                <th>{t('user.number')}</th>
                                <th>{t('user.repo')}</th>
                                <th>{t('user.lang')}</th>
                                <th>{t('user.size')}</th>
                                <th>Stars</th>
                                <th>Watchers</th>
                                <th>Forks</th>
                                <th>{t('user.open_issues')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => {
                                return <Repo item={item} index={index + 1} key={index} />;
                            })}
                            {data?.length === 0 && (
                                <>
                                    <tr className="text-center text-gray-500">
                                        <td colSpan={4}>{t('user.no_repos')}</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </>
            ) : (
                <Skeleton height={208} />
            )}
        </div>
    );
};

interface repoProps {
    item: MinimalRepository;
    index: number;
}

const Repo: React.FC<repoProps> = ({ item, index: key }) => {
    const { t } = useTranslation();
    return (
        <tr className="text-sm text-center">
            <td>{key}</td>
            <td>
                <a
                    className="text-gray-700 hover:bg-gray-200 transition-all px-1 rounded-md"
                    target="_blank"
                    rel="noreferrer"
                    href={item.html_url}>
                    {item.full_name}
                    {item.fork && (
                        <Tooltip label={t('user.is_fork')}>
                            <span className="text-xs ml-1">
                                <ForkOutlined />
                            </span>
                        </Tooltip>
                    )}
                </a>
            </td>
            <td>{item.language ?? t('user.unknown')}</td>
            <td>{item.size ?? t('user.unknown')} KB</td>
            <td>{item.stargazers_count ?? t('user.unknown')}</td>
            <td>{item.watchers_count ?? t('user.unknown')}</td>
            <td>{item.forks_count ?? t('user.unknown')}</td>
            <td>{item.open_issues_count ?? t('user.unknown')}</td>
        </tr>
    );
};

export default UserRepositories;
