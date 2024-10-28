import { useTranslation } from 'react-i18next';
import { MinimalRepository, User, UserRepos } from '~/utils/requests/ghapis/typings/user';
import { Loader, Skeleton, Tooltip } from '@mantine/core';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ForkOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { ZodError } from 'zod';
import axios from 'axios';
import { githubUser } from '~/utils/requests/ghapis/user';
import { useParams } from '@remix-run/react';

interface userRepositoriesProps {
    data: User;
    user: MutableRefObject<githubUser>;
}

const UserRepositories: React.FC<userRepositoriesProps> = ({ data, user }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    const [repos, setRepos] = useState<null | UserRepos>(null);
    const params = useParams();
    const effectCache = useRef<boolean>(false),
        effectFlag = useRef<boolean>(false);
    useEffect(() => {
        titleRef.current && autoAnimate(titleRef.current);
    }, [titleRef]);
    useEffect(() => {
        const getAndSetUserInfos = async () => {
            try {
                user.current.setUserName(params?.name ?? '');
                setRepos(await user.current.getUserRepos());
            } catch (e) {
                console.error(e);
                // eslint-disable-next-line import/no-named-as-default-member
                if (axios.isAxiosError(e)) {
                    console.error(e);
                    if (e.status === 404) toast.error(t('user.err.not_found'));
                    if (e.status === 403) {
                        throw toast.error(t('user.err.rate_limit'));
                    } else toast.error(t('user.err.something_wrong'));
                } else if (e instanceof ZodError) toast.error(t('user.err.parse_error'));
                else toast.error(t('user.err.something_wrong'));
            }
        };
        setRepos(null);
        if (!effectCache.current) {
            effectCache.current = true;
            getAndSetUserInfos();
        }
        if (effectFlag.current) {
            // 重新请求前重置
            effectCache.current = false;
            effectFlag.current = false;
        }
        return () => {
            effectFlag.current = true;
        };
        // getAndSetUserRegion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, t, user]);
    return (
        <div className="flex flex-col w-full bg-white p-8 pt-0 rounded-lg gap-4 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-bold sticky top-0 mt-4 bg-white py-1">
                {t('user.userRepos')}
                <span className="font-normal ml-4 text-base" ref={titleRef}>
                    {!repos ? <Loader size="xs" /> : `${repos?.length ?? '_'} / ${data.public_repos ?? '_'}`}
                </span>
            </h2>
            {repos ? (
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
                            {repos.map((item, index) => {
                                return <Repo item={item} index={index + 1} key={index} />;
                            })}
                            {repos?.length === 0 && (
                                <>
                                    <tr className="text-center text-gray-500">
                                        <td colSpan={8}>{t('user.no_repos')}</td>
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
