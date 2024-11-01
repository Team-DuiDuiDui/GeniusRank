import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';
import dayjs from 'dayjs';
import { Table, Tooltip } from '@mantine/core';
import { CommonLink } from '../../infoLink';
import { PullRequestDetail, UserDetail } from '~/utils/requests/ghGraphql/typings/user';
import {
    CommentOutlined,
    EyeOutlined,
    ForkOutlined,
    IssuesCloseOutlined,
    MergeOutlined,
    PullRequestOutlined,
    StarOutlined,
} from '@ant-design/icons';
import { TFunction } from 'i18next';
import CardWithScrollableTableDetail from './cardWithScrollableTable';

interface userIssuesProps {
    data: UserDetail;
}

const UserPullRequestsDetail: React.FC<userIssuesProps> = ({ data }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    const prNode = (
        data?.pullRequests.nodes.length > 0
            ? data?.pullRequests.nodes[0] !== null
                ? data?.pullRequests.nodes
                : []
            : []
    ) as PullRequestDetail[] | [];
    useEffect(() => {
        titleRef.current && autoAnimate(titleRef.current);
    }, [titleRef]);
    return (
        <CardWithScrollableTableDetail
            title={t('user.userRecentPrs_all')}
            columns={[
                t('user.number'),
                t('user.pr_title'),
                t('user.status'),
                t('user.commits'),
                t('user.update_time'),
                t('user.repo'),
                t('user.lang'),
                t('user.repo_info'),
            ]}
            data={prNode}
            dataCount={data?.issues.totalCount ?? 0}
            renderRow={(item: PullRequestDetail, index: number) => (
                <Prs item={item} index={index + 1} key={index} t={t} />
            )}
        />
    );
};

export default UserPullRequestsDetail;

interface issueProps {
    item: PullRequestDetail;
    index: number;
    t: TFunction<'translation', undefined>;
}

const Prs: React.FC<issueProps> = ({ item, index: key, t }) => {
    const {
        stargazerCount,
        forkCount,
        issues,
        pullRequests,
        discussions,
        watchers,
        url: baseUrl,
    } = item.baseRepository ?? {};
    return (
        <Table.Tr>
            <Table.Td>{key}</Table.Td>
            <Table.Td>
                <CommonLink href={item.url}>
                    {item.title}
                    <span className="text-xs text-gray-500">#{item.number}</span>
                </CommonLink>
            </Table.Td>
            <Table.Td>
                <Tooltip label={item.state}>
                    <span
                        className={[
                            item.state === 'OPEN'
                                ? 'text-green-500'
                                : item.state === 'MERGED'
                                ? 'text-purple-500'
                                : 'text-red-500',
                            'text-xl',
                        ].join(' ')}>
                        {item.state === 'OPEN' ? (
                            <PullRequestOutlined />
                        ) : item.state === 'MERGED' ? (
                            <MergeOutlined />
                        ) : (
                            <PullRequestOutlined />
                        )}
                    </span>
                </Tooltip>
            </Table.Td>
            <Table.Td>{item.commits.totalCount}</Table.Td>
            <Table.Td>{dayjs(item.updatedAt).format('YYYY/MM/DD HH:mm:ss UTCZ')}</Table.Td>
            {item.baseRepository ? (
                <>
                    <Table.Td>
                        <CommonLink href={item.baseRepository.url}>
                            {baseUrl!
                                .match(/\/github.com\/([^/]+\/[^/]+)/i)
                                ?.slice(1)
                                .join('')}
                            {item.baseRepository.isFork && (
                                <Tooltip label={t('user.is_fork')}>
                                    <span className="text-xs ml-1">
                                        <ForkOutlined />
                                    </span>
                                </Tooltip>
                            )}
                        </CommonLink>
                    </Table.Td>
                    <Table.Td>{item.baseRepository.primaryLanguage?.name ?? t('user.unknown')}</Table.Td>
                    <Table.Td className="flex flex-wrap gap-2 w-52 cursor-default">
                        <Tooltip label="stars">
                            <span>
                                <StarOutlined className="mr-1" />
                                {stargazerCount}
                            </span>
                        </Tooltip>
                        <Tooltip label="fork">
                            <span>
                                <ForkOutlined className="mr-1" />
                                {forkCount}
                            </span>
                        </Tooltip>
                        <Tooltip label="watchers">
                            <span>
                                <EyeOutlined className="mr-1" />
                                {watchers!.totalCount}
                            </span>
                        </Tooltip>
                        {issues && (
                            <Tooltip label="Issues">
                                <span>
                                    <IssuesCloseOutlined className="mr-1" />
                                    {issues.totalCount}
                                </span>
                            </Tooltip>
                        )}
                        {pullRequests && (
                            <Tooltip label="Pull Requests">
                                <span>
                                    <PullRequestOutlined className="mr-1" />
                                    {pullRequests.totalCount}
                                </span>
                            </Tooltip>
                        )}
                        {discussions && (
                            <Tooltip label="Discussions">
                                <span>
                                    <CommentOutlined className="mr-1" />
                                    {discussions.totalCount}
                                </span>
                            </Tooltip>
                        )}
                    </Table.Td>
                </>
            ) : (
                <>
                    <Table.Td>{t('user.no_data')}</Table.Td>
                    <Table.Td>{t('user.no_data')}</Table.Td>
                    <Table.Td>{t('user.no_data')}</Table.Td>
                </>
            )}
        </Table.Tr>
    );
};
