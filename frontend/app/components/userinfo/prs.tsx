import { useTranslation } from 'react-i18next';
import { IssueSearchResult, IssueSearchResultItem } from '~/utils/requests/ghapis/typings/user';
import dayjs from 'dayjs';
import { Loader, Skeleton } from '@mantine/core';
import { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';

interface userPRs {
    data: IssueSearchResult | null;
}

const UserPRs: React.FC<userPRs> = ({ data }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    useEffect(() => {
        titleRef.current && autoAnimate(titleRef.current);
    }, [titleRef]);
    return (
        <div className="flex flex-col w-full bg-white p-8 pt-0 rounded-lg gap-4 max-h-56 overflow-y-auto">
            <h2 className="text-lg font-bold sticky top-0 mt-4 bg-white py-1">
                {t('user.userRecentPrs')}
                <span className="font-normal ml-4 text-base" ref={titleRef}>
                    {!data ? <Loader size="xs" /> : `${data?.items.length ?? '_'} / ${data?.total_count ?? '_'}`}
                </span>
            </h2>
            {data ? (
                <table className="w-full">
                    <thead>
                        <tr className="mb-6">
                            <th>{t('user.number')}</th>
                            <th>{t('user.repo')}</th>
                            <th>{t('user.pr_title')}</th>
                            <th>{t('user.update_time')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.items.map((item, index) => {
                            return <Pr item={item} index={index + 1} key={index} />;
                        })}
                    </tbody>
                </table>
            ) : (
                <Skeleton height={208} />
            )}
        </div>
    );
};

interface pr {
    item: IssueSearchResultItem;
    index: number;
}

const Pr: React.FC<pr> = ({ item, index: key }) => {
    return (
        <tr className="text-sm text-center">
            <td>{key}</td>
            <td>
                <a
                    className="text-gray-700 hover:bg-gray-200 transition-all px-1 rounded-md"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://github.com/${item.repository_url
                        .match(/\/repos\/([^/]+\/[^/]+)/i)
                        ?.slice(1)
                        .join('')}`}>
                    {item.repository_url
                        .match(/\/repos\/([^/]+\/[^/]+)/i)
                        ?.slice(1)
                        .join('')}
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

export default UserPRs;
