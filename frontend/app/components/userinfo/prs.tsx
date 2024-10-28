import { useTranslation } from 'react-i18next';
import { IssueSearchResult, IssueSearchResultItem, User } from '~/utils/requests/ghapis/typings/user';
import dayjs from 'dayjs';
import { Loader, Skeleton } from '@mantine/core';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { githubUser } from '~/utils/requests/ghapis/user';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import { useParams } from '@remix-run/react';
import sleep from '~/utils/sleep';
import ErrorNote from './error';

interface userPRs {
    data: User;
    user: MutableRefObject<githubUser>;
}

const UserPRs: React.FC<userPRs> = ({ data, user }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    const [prs, setPRs] = useState<null | IssueSearchResult>(null);
    const [error, setErrors] = useState<null | AxiosError | ZodError | unknown>(null);
    const params = useParams();
    const effectCache = useRef<boolean>(false),
        effectFlag = useRef<boolean>(false);
    useEffect(() => {
        titleRef.current && autoAnimate(titleRef.current);
    }, [titleRef]);
    const getAndSetUserInfos = async () => {
        setErrors(null);
        await sleep(400);
        try {
            user.current.setUserName(params?.name ?? '');
            setPRs(await user.current.getUserPrs());
        } catch (e) {
            console.error(e);
            setErrors(e);
        }
    };
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
        // getAndSetUserRegion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, t, user]);
    return (
        <div className="flex flex-col w-full bg-white p-8 pt-0 rounded-lg gap-4 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-bold sticky top-0 mt-4 bg-white py-1">
                {t('user.userRecentPrs')}
                <span className="font-normal ml-4 text-base" ref={titleRef}>
                    {!prs && !error ? <Loader size={16} /> : `${prs?.items.length ?? '_'} / ${prs?.total_count ?? '_'}`}
                    <ErrorNote error={error} reload={getAndSetUserInfos} />
                </span>
            </h2>
            {prs ? (
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
                        {prs.items.map((item, index) => {
                            return <Pr item={item} index={index + 1} key={index} />;
                        })}
                        {prs?.items.length === 0 && (
                            <>
                                <tr className="text-center text-gray-500">
                                    <td colSpan={4}>{t('user.no_issues')}</td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            ) : (
                <Skeleton height={208} animate={!error} />
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
