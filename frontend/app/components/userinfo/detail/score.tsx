import { useTranslation } from 'react-i18next';
import { Card } from './card';
import { UserScoreCharts } from '../score';
import { GithubScoreRes } from '~/api/backend/typings/beRes';
import { UserDetail } from '~/api/github/graphql/typings/user';
import { CopyButton, Tooltip } from '@mantine/core';
import { CheckOutlined, CopyOutlined, LinkOutlined } from '@ant-design/icons';

interface userRepositoriesProps {
    scores: GithubScoreRes | null;
    data: UserDetail;
    error?: unknown;
}

const UserScoreDetail: React.FC<userRepositoriesProps> = ({ scores, data, error }) => {
    const { t } = useTranslation();

    return (
        <>
            <Card title={t('user.score.title_detail')} error={error} isBackendRequest>
                <div className="flex justify-center">
                    {scores && !error && <UserScoreCharts scores={scores} t={t} />}
                </div>
                {scores && !error && (
                    <div className="flex justify-end items-center p-2 gap-2">
                        <p className="border border-gray-500 rounded-md overflow-hidden w-fit flex flex-row">
                            <span className="bg-gray-200 dark:bg-slate-700 dark:text-gray-300 px-4 flex items-center text-gray-700">
                                {t('user.score.copy_card')}
                            </span>
                            <input
                                className="px-4 py-2 focus-visible:outline-none w-80"
                                readOnly
                                value={`[![Genius Rank](https://geniusrank.heuluck.top/card/${data.login})](https://geniusrank.heuluck.top/)`}
                            />
                            <CopyButton
                                value={`[![Genius Rank](https://geniusrank.heuluck.top/card/${data.login})](https://geniusrank.heuluck.top/)`}>
                                {({ copied, copy }) => (
                                    <Tooltip label={copied ? t('user.score.copied') : t('user.score.copy')}>
                                        <button
                                            onClick={copy}
                                            className="text-lg px-3 aspect-square btn-transparent transition-all rounded-md">
                                            {copied ? <CheckOutlined className="text-green-400" /> : <CopyOutlined />}
                                        </button>
                                    </Tooltip>
                                )}
                            </CopyButton>
                            <Tooltip label={t('user.score.open')}>
                                <a
                                    href={`https://geniusrank.heuluck.top/card/${data.login}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-lg px-3 aspect-square btn-transparent flex items-center justify-center rounded-md">
                                    <LinkOutlined />
                                </a>
                            </Tooltip>
                        </p>
                    </div>
                )}
            </Card>
        </>
    );
};

export default UserScoreDetail;
