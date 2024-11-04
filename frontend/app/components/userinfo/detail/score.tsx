import { useTranslation } from 'react-i18next';
import { Card } from './card';
import { LoadingOverlay } from '@mantine/core';
import { UserScoreCharts } from '../score';
import { GithubScoreRes } from '~/api/typings/beRes';

interface userRepositoriesProps {
    scores: GithubScoreRes;
    error?: unknown;
}

const UserScoreDetail: React.FC<userRepositoriesProps> = ({ scores, error }) => {
    const { t } = useTranslation();

    return (
        <>
            <Card title={t('user.score.title')} error={error} isBackendRequest>
                <LoadingOverlay visible={!scores && !error} loaderProps={{ type: 'dots' }} />
                <div className="flex justify-center">
                    {scores && !error && <UserScoreCharts scores={scores} t={t} />}
                </div>
            </Card>
        </>
    );
};

export default UserScoreDetail;
