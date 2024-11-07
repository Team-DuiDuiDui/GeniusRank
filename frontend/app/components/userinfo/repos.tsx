import { useTranslation } from 'react-i18next';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import { githubUser } from '~/api/github/rest/user';
import { useParams } from '@remix-run/react';
import { MinimalRepository, User } from '~/api/github/rest/typings/user';
import { Table, Tooltip } from '@mantine/core';
import { ForkOutlined } from '@ant-design/icons';
import CardWithScrollableTable from './cardWithScrollableTable';
import { CommonLink } from '../infoLink';

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
    const effectFlag = useRef<boolean>(false);

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
        if (effectFlag.current) {
            // 重新请求前重置
            effectCache.current = false;
            effectFlag.current = false;
        }
        return () => {
            effectFlag.current = true;
        };
    }, [data, user, getAndSetUserInfos]);

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
                t('user.open_issues'),
            ]}
            data={repos}
            dataCount={data.public_repos ?? 0}
            error={error}
            reload={getAndSetUserInfos}
            renderRow={(item: MinimalRepository, index: number) => <Repo item={item} index={index + 1} key={index} />}
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
        <Table.Tr>
            <Table.Td>{key}</Table.Td>
            <Table.Td>
                <CommonLink href={item.html_url}>
                    {item.full_name}
                    {item.fork && (
                        <Tooltip label={t('user.is_fork')}>
                            <span className="text-xs ml-1">
                                <ForkOutlined />
                            </span>
                        </Tooltip>
                    )}
                </CommonLink>
            </Table.Td>
            <Table.Td>{item.language ?? t('user.unknown')}</Table.Td>
            <Table.Td>{item.size ?? t('user.unknown')} KB</Table.Td>
            <Table.Td>{item.stargazers_count ?? t('user.unknown')}</Table.Td>
            <Table.Td>{item.watchers_count ?? t('user.unknown')}</Table.Td>
            <Table.Td>{item.forks_count ?? t('user.unknown')}</Table.Td>
            <Table.Td>{item.open_issues_count ?? t('user.unknown')}</Table.Td>
        </Table.Tr>
    );
};
