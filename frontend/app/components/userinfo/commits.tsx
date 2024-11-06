import { useTranslation } from 'react-i18next';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import { githubUser } from '~/api/github/rest/user';
import { useParams } from '@remix-run/react';
import { CommitSearchResultItem, CommitsSearchResult, User } from '~/api/github/rest/typings/user';
import CardWithScrollableTable from './cardWithScrollableTable'; // 使用通用的 CardWithScrollableTable 组件
import { TFunction } from 'i18next';
import { Table } from '@mantine/core';
import { CommonLink } from '../infoLink';

interface userCommitsProps {
    data: User;
    user: MutableRefObject<githubUser>;
}

const UserCommits: React.FC<userCommitsProps> = ({ data, user }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    const [commits, setCommits] = useState<null | CommitsSearchResult>(null);
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
            const fetchedCommits = await user.current.getUserCommits();
            setCommits(fetchedCommits);
        } catch (e) {
            console.error(e);
            setErrors(e);
        }
    }, [params?.name, user]);

    useEffect(() => {
        setCommits(null);
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
            title={t('user.userRecentCommits')}
            columns={[
                t('user.number'),
                t('user.repo'),
                t('user.commit_message'),
                t('user.author'),
                t('user.committer'),
            ]}
            data={commits?.items}
            dataCount={commits?.total_count ?? 0}
            error={error}
            reload={getAndSetUserInfos}
            renderRow={(item: CommitSearchResultItem, index: number) => (
                <Commit data={data} item={item} index={index + 1} key={index} t={t} />
            )}
        />
    );
};

export default UserCommits;

interface commitProps {
    data: User;
    item: CommitSearchResultItem;
    index: number;
    t: TFunction<'translation', undefined>;
}

const Commit: React.FC<commitProps> = ({ data, item, index: key, t }) => {
    return (
        <Table.Tr>
            <Table.Td>{key}</Table.Td>
            <Table.Td>
                <CommonLink href={item.repository.html_url}>{item.repository.full_name}</CommonLink>
            </Table.Td>
            <Table.Td>
                <CommonLink href={item.html_url}>{item.commit.message}</CommonLink>
            </Table.Td>
            <Table.Td>
                <CommonLink href={data.html_url}>{item.commit.author?.name ?? data.name}</CommonLink>
            </Table.Td>
            <Table.Td>{item.commit.committer?.name ?? t('user.unknown')}</Table.Td>
        </Table.Tr>
    );
};
