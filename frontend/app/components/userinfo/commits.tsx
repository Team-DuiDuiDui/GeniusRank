import { useTranslation } from 'react-i18next';
import { CommitSearchResultItem, CommitsSearchResult, User } from '~/utils/requests/ghapis/typings/user';
import { Loader, Skeleton } from '@mantine/core';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { githubUser } from '~/utils/requests/ghapis/user';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ZodError } from 'zod';
import { useParams } from '@remix-run/react';
import sleep from '~/utils/sleep';
import { TFunction } from 'i18next';

interface userPRs {
    data: User;
    user: MutableRefObject<githubUser>;
}

const UserCommits: React.FC<userPRs> = ({ data, user }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    const [commits, setCommits] = useState<null | CommitsSearchResult>(null);
    const params = useParams();
    const effectCache = useRef<boolean>(false),
        effectFlag = useRef<boolean>(false);
    useEffect(() => {
        titleRef.current && autoAnimate(titleRef.current);
    }, [titleRef]);
    useEffect(() => {
        const getAndSetUserInfos = async () => {
            await sleep(1200);
            try {
                user.current.setUserName(params?.name ?? '');
                setCommits(await user.current.getUserCommits());
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
        // getAndSetUserRegion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, t, user]);
    return (
        <div className="flex flex-col w-full bg-white p-8 pt-0 rounded-lg gap-4 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-bold sticky top-0 mt-4 bg-white py-1">
                {t('user.userRecentCommits')}
                <span className="font-normal ml-4 text-base" ref={titleRef}>
                    {!commits ? (
                        <Loader size="xs" />
                    ) : (
                        `${commits?.items.length ?? '_'} / ${commits?.total_count ?? '_'}`
                    )}
                </span>
            </h2>
            {commits ? (
                <table className="w-full">
                    <thead>
                        <tr className="mb-6">
                            <th>{t('user.number')}</th>
                            <th>{t('user.repo')}</th>
                            <th>{t('user.commit_message')}</th>
                            <th>{t('user.author')}</th>
                            <th>{t('user.committer')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {commits.items.map((item, index) => {
                            return <Pr data={data} item={item} index={index + 1} key={index} t={t} />;
                        })}
                        {commits?.items.length === 0 && (
                            <>
                                <tr className="text-center text-gray-500">
                                    <td colSpan={5}>{t('user.no_commits')}</td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            ) : (
                <Skeleton height={208} />
            )}
        </div>
    );
};

interface pr {
    data: User;
    item: CommitSearchResultItem;
    index: number;
    t: TFunction<'translation', undefined>;
}

const Pr: React.FC<pr> = ({ data, item, index: key, t }) => {
    return (
        <tr className="text-sm text-center">
            <td>{key}</td>
            <td>
                <a
                    className="text-gray-700 hover:bg-gray-200 transition-all px-1 rounded-md"
                    target="_blank"
                    rel="noreferrer"
                    href={item.repository.html_url}>
                    {item.repository.full_name}
                </a>
            </td>
            <td>
                <a
                    className="text-gray-700 hover:bg-gray-200 transition-all px-1 rounded-md"
                    href={item.html_url}
                    target="_blank"
                    rel="noreferrer">
                    {item.commit.message}
                </a>
            </td>
            <td>
                <a
                    className="text-gray-700 hover:bg-gray-200 transition-all px-1 rounded-md"
                    href={data.html_url}
                    target="_blank"
                    rel="noreferrer">
                    {item.commit.author?.name ?? data.name}
                </a>
            </td>
            <td>{item.commit.committer?.name ?? t('user.unknown')}</td>
        </tr>
    );
};

export default UserCommits;
