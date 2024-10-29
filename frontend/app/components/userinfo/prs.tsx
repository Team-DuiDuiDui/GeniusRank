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
    }, [data, t, user, getAndSetUserInfos]);

    return (
        <CardWithScrollableTable
            title={t('user.userRecentPrs')}
            columns={[
                t('user.number'),
                t('user.repo'),
                t('user.pr_title'),
                t('user.update_time')
            ]}
            data={prs?.items}
            dataCount={prs?.total_count ?? 0}
            error={error}
            reload={getAndSetUserInfos}
            renderRow={(item: IssueSearchResultItem, index: number) => (
                <Pr item={item} index={index + 1} key={index} />
            )}
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
