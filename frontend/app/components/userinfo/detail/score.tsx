import { useTranslation } from 'react-i18next';
import { Card } from './card';
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
            <Card title={t('user.score.title_detail')} error={error} isBackendRequest>
                <div className="flex justify-center">
                    {scores && !error && <UserScoreCharts scores={scores} t={t} />}
                </div>
            </Card>
        </>
    );
};

export default UserScoreDetail;
