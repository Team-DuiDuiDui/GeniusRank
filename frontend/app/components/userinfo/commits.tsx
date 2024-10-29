import { useTranslation } from 'react-i18next';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import { githubUser } from '~/utils/requests/ghapis/user';
import { useParams } from '@remix-run/react';
import { CommitSearchResultItem, CommitsSearchResult, User } from '~/utils/requests/ghapis/typings/user';
import CardWithScrollableTable from './cardWithScrollableTable'; // 使用通用的 CardWithScrollableTable 组件
import { TFunction } from 'i18next';

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
    }, [data, t, user, getAndSetUserInfos]);

    return (
        <CardWithScrollableTable
            title={t('user.userRecentCommits')}
            columns={[
                t('user.number'),
                t('user.repo'),
                t('user.commit_message'),
                t('user.author'),
                t('user.committer')
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
    t: TFunction<"translation", undefined>;
}

const Commit: React.FC<commitProps> = ({ data, item, index: key, t }) => {
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
