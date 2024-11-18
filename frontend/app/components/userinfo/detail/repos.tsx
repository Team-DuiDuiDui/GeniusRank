import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { Table, Tooltip } from '@mantine/core';
import { CommonLink } from '../../infoLink';
import { RepositoryDetail, UserDetail } from '~/api/github/graphql/typings/user';
import { ForkOutlined } from '@ant-design/icons';
import { TFunction } from 'i18next';
import CardWithScrollableTableDetail from './cardWithScrollableTable';
import RepoInfo from './repoinfo';

interface userIssuesProps {
    data: UserDetail;
}

const UserReposDetail: React.FC<userIssuesProps> = ({ data }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    const issueNode = (
        data?.repositories.nodes.length > 0
            ? data?.repositories.nodes[0] !== null
                ? data?.repositories.nodes
                : []
            : []
    ) as RepositoryDetail[] | [];
    useEffect(() => {
        titleRef.current && autoAnimate(titleRef.current);
    }, [titleRef]);
    return (
        <CardWithScrollableTableDetail
            title={t('user.userRepos_50', { total: issueNode?.length ?? 50 })}
            columns={[t('user.number'), t('user.repo'), t('user.lang'), t('user.repo_info')]}
            data={issueNode}
            dataCount={data?.repositories.totalCount ?? 0}
            renderRow={(item: RepositoryDetail, index: number) => (
                <Repo item={item} index={index + 1} key={index} t={t} />
            )}
            reverse
        />
    );
};

export default UserReposDetail;

interface repoProps {
    item: RepositoryDetail;
    index: number;
    t: TFunction<'translation', undefined>;
}

export const Repo: React.FC<repoProps> = ({ item, index: key, t }) => {
    return (
        <Table.Tr>
            <Table.Td>{key}</Table.Td>
            <Table.Td>
                <CommonLink href={item.url}>
                    {item.url
                        .match(/\/github.com\/([^/]+\/[^/]+)/i)
                        ?.slice(1)
                        .join('')}
                    {item.isFork && (
                        <Tooltip label={t('user.is_fork')}>
                            <span className="text-xs ml-1">
                                <ForkOutlined />
                            </span>
                        </Tooltip>
                    )}
                </CommonLink>
            </Table.Td>
            <Table.Td>{item.primaryLanguage?.name ?? t('user.unknown')}</Table.Td>
            <RepoInfo repository={item} />
        </Table.Tr>
    );
};
