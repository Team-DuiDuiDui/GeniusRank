import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { RepositoryDetail, UserDetail } from '~/utils/requests/ghGraphql/typings/user';
import CardWithScrollableTableDetail from './cardWithScrollableTable';
import { Repo } from './repos';

interface userIssuesProps {
    data: UserDetail;
}

const UserReposContributeDetail: React.FC<userIssuesProps> = ({ data }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    const issueNode = (
        data?.repositoriesContributedTo.nodes.length > 0
            ? data?.repositoriesContributedTo.nodes[0] !== null
                ? data?.repositoriesContributedTo.nodes
                : []
            : []
    ) as RepositoryDetail[] | [];
    useEffect(() => {
        titleRef.current && autoAnimate(titleRef.current);
    }, [titleRef]);
    return (
        <CardWithScrollableTableDetail
            title={t('user.userContributeRepos')}
            columns={[t('user.number'), t('user.repo'), t('user.lang'), t('user.repo_info')]}
            data={issueNode}
            dataCount={data?.repositoriesContributedTo.totalCount ?? 0}
            renderRow={(item: RepositoryDetail, index: number) => (
                <Repo item={item} index={index + 1} key={index} t={t} />
            )}
        />
    );
};

export default UserReposContributeDetail;
