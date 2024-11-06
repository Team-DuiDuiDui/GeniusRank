import { useTranslation } from 'react-i18next';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import { githubUser } from '~/api/github/rest/user';
import { useParams } from '@remix-run/react';
import { IssueSearchResult, IssueSearchResultItem, User } from '~/api/github/rest/typings/user';
import dayjs from 'dayjs';
import CardWithScrollableTable from './cardWithScrollableTable'; // 使用通用的 CardWithScrollableTable 组件
import { Table } from '@mantine/core';
import { CommonLink } from '../infoLink';

interface userPRsProps {
    data: User;
    user: MutableRefObject<githubUser>;
}

const UserPRs: React.FC<userPRsProps> = ({ data, user }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    const [prs, setPRs] = useState<null | IssueSearchResult>(null);
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
            const fetchedPRs = await user.current.getUserPrs();
            setPRs(fetchedPRs);
        } catch (e) {
            console.error(e);
            setErrors(e);
        }
    }, [params?.name, user]);

    useEffect(() => {
        setPRs(null);
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
            title={t('user.userRecentPrs')}
            columns={[t('user.number'), t('user.repo'), t('user.pr_title'), t('user.update_time')]}
            data={prs?.items}
            dataCount={prs?.total_count ?? 0}
            error={error}
            reload={getAndSetUserInfos}
            renderRow={(item: IssueSearchResultItem, index: number) => <Pr item={item} index={index + 1} key={index} />}
        />
    );
};

export default UserPRs;

interface prProps {
    item: IssueSearchResultItem;
    index: number;
}

const Pr: React.FC<prProps> = ({ item, index: key }) => {
    return (
        <Table.Tr>
            <Table.Td>{key}</Table.Td>
            <Table.Td>
                <CommonLink
                    href={`https://github.com/${item.repository_url
                        .match(/\/repos\/([^/]+\/[^/]+)/i)
                        ?.slice(1)
                        .join('')}`}>
                    {item.repository_url
                        .match(/\/repos\/([^/]+\/[^/]+)/i)
                        ?.slice(1)
                        .join('')}
                </CommonLink>
            </Table.Td>
            <Table.Td>
                <CommonLink href={item.html_url}>
                    {item.title}
                    <span className="text-xs text-gray-500">#{item.number}</span>
                </CommonLink>
            </Table.Td>
            <Table.Td>{dayjs(item.updated_at).format('YYYY/MM/DD HH:mm')}</Table.Td>
        </Table.Tr>
    );
};
