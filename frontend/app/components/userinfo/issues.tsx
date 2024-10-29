import { useTranslation } from 'react-i18next';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import { githubUser } from '~/utils/requests/ghapis/user';
import { useParams } from '@remix-run/react';
import { IssueSearchResult, IssueSearchResultItem, User } from '~/utils/requests/ghapis/typings/user';
import dayjs from 'dayjs';
import CardWithScrollableTable from './cardWithScrollableTable'; // 使用通用的 CardWithScrollableTable 组件

interface userIssuesProps {
    data: User;
    user: MutableRefObject<githubUser>;
}

const UserIssues: React.FC<userIssuesProps> = ({ data, user }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    const [issues, setIssues] = useState<null | IssueSearchResult>(null);
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
            const fetchedIssues = await user.current.getUserIssues();
            setIssues(fetchedIssues);
        } catch (e) {
            console.error(e);
            setErrors(e);
        }
    }, [params?.name, user]);

    useEffect(() => {
        setIssues(null);
        if (!effectCache.current) {
            effectCache.current = true;
            getAndSetUserInfos();
        }
    }, [data, t, user, getAndSetUserInfos]);

    return (
        <CardWithScrollableTable
            title={t('user.userRecentIssues')}
            columns={[
                t('user.number'),
                t('user.repo'),
                t('user.issue_title'),
                t('user.update_time')
            ]}
            data={issues?.items}
            dataCount={issues?.total_count ?? 0}
            error={error}
            reload={getAndSetUserInfos}
            renderRow={(item: IssueSearchResultItem, index: number) => (
                <Issue item={item} index={index + 1} key={index} />
            )}
        />
    );
};

export default UserIssues;

interface issueProps {
    item: IssueSearchResultItem;
    index: number;
}

const Issue: React.FC<issueProps> = ({ item, index: key }) => {
    return (
        <tr className="text-sm text-center">
            <td>{key}</td>
            <td>
                <a
                    className="text-gray-700 hover:bg-gray-200 transition-all px-1 rounded-md"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://github.com/${item.repository_url.match(/\/repos\/([^/]+\/[^/]+)/i)?.slice(1).join('')}`}>
                    {item.repository_url.match(/\/repos\/([^/]+\/[^/]+)/i)?.slice(1).join('')}
                </a>
            </td>
            <td>
                <a
                    className="text-gray-700 hover:bg-gray-200 transition-all px-1 rounded-md"
                    href={item.html_url}
                    target="_blank"
                    rel="noreferrer">
                    {item.title}
                    <span className="text-xs text-gray-500">#{item.number}</span>
                </a>
            </td>
            <td>{dayjs(item.updated_at).format('YYYY/MM/DD HH:mm:ss UTCZ')}</td>
        </tr>
    );
};
