import { useTranslation } from 'react-i18next';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import { githubUser } from '~/utils/requests/ghapis/user';
import { useParams } from '@remix-run/react';
import { MinimalRepository, User } from '~/utils/requests/ghapis/typings/user';
import { Tooltip } from '@mantine/core';
import { ForkOutlined } from '@ant-design/icons';
import CardWithScrollableTable from './cardWithScrollableTable';

interface userRepositoriesProps {
    data: User;
    user: MutableRefObject<githubUser>;
}

const UserRepositories: React.FC<userRepositoriesProps> = ({ data, user }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    const [repos, setRepos] = useState<null | MinimalRepository[]>(null);
    const [error, setErrors] = useState<null | AxiosError | ZodError | unknown>(null);
    const params = useParams();
    const effectCache = useRef<boolean>(false);

    useEffect(() => {
        titleRef.current && autoAnimate(titleRef.current);
    }, [titleRef]);

    const getAndSetUserInfos = useCallback(async () => {
        setErrors(null);
        try {
            user.current.setUserName(params?.name ?? '');
            const fetchedRepos = await user.current.getUserRepos();
            setRepos(fetchedRepos);
        } catch (e) {
            console.error(e);
            setErrors(e);
        }
    }, [params?.name, user]);

    useEffect(() => {
        setRepos(null);
        if (!effectCache.current) {
            effectCache.current = true;
            getAndSetUserInfos();
        }
    }, [data, t, user, getAndSetUserInfos]);

    return (
        <CardWithScrollableTable
            title={t('user.userRepos')}
            columns={[
                t('user.number'),
                t('user.repo'),
                t('user.lang'),
                t('user.size'),
                'Stars',
                'Watchers',
                'Forks',
                t('user.open_issues')
            ]}
            data={repos}
            dataCount={data.public_repos ?? 0}
            error={error}
            reload={getAndSetUserInfos}
            renderRow={(item: MinimalRepository, index: number) => (
                <Repo item={item} index={index + 1} key={index} />
            )}
        />
    );
};

export default UserRepositories;

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