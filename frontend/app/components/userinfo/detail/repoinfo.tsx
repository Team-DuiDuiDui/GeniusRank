import {
    CommentOutlined,
    EyeOutlined,
    ForkOutlined,
    IssuesCloseOutlined,
    PullRequestOutlined,
    StarOutlined,
} from '@ant-design/icons';
import { Table, Tooltip } from '@mantine/core';
import { RepositoryDetail } from '~/utils/requests/ghGraphql/typings/user';
import './repoinfo.css';

interface repoInfoProps {
    repository: RepositoryDetail;
    flat?: boolean;
}

const RepoInfo: React.FC<repoInfoProps> = ({ repository, flat = false }) => {
    const { stargazerCount, forkCount, issues, pullRequests, discussions, watchers } = repository;
    return (
        <Table.Td className={`grid ${flat ? 'grid-cols-6' : 'grid-cols-3 grid-rows-2'} gap-2 cursor-default w-max`}>
            <Tooltip label="stars">
                <span className="mark">
                    <StarOutlined />
                    {stargazerCount}
                </span>
            </Tooltip>
            <Tooltip label="fork">
                <span className="mark">
                    <ForkOutlined />
                    {forkCount}
                </span>
            </Tooltip>
            <Tooltip label="watchers">
                <span className="mark">
                    <EyeOutlined />
                    {watchers.totalCount}
                </span>
            </Tooltip>
            {issues && (
                <Tooltip label="Issues">
                    <span className="mark">
                        <IssuesCloseOutlined />
                        {issues.totalCount}
                    </span>
                </Tooltip>
            )}
            {pullRequests && (
                <Tooltip label="Pull Requests">
                    <span className="mark">
                        <PullRequestOutlined />
                        {pullRequests.totalCount}
                    </span>
                </Tooltip>
            )}
            {discussions && (
                <Tooltip label="Discussions">
                    <span className="mark">
                        <CommentOutlined />
                        {discussions.totalCount}
                    </span>
                </Tooltip>
            )}
        </Table.Td>
    );
};

export default RepoInfo;
