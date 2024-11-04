import { useTranslation } from 'react-i18next';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ZodError } from 'zod';
import axios, { AxiosError } from 'axios';
import { githubUser } from '~/utils/requests/ghapis/user';
import { User } from '~/utils/requests/ghapis/typings/user';
import { Card } from './cardScrollable';
import toast from 'react-hot-toast';
import { BackEndError } from '~/hooks/useAxiosInstanceForBe';
import handleErrorCode from '~/utils/handleErrorCode';
import { LoadingOverlay } from '@mantine/core';
import { BarChart, PieChart, RadarChart } from '@mantine/charts';
import { TFunction } from 'i18next';

interface userRepositoriesProps {
    data: User;
    user: MutableRefObject<githubUser>;
}

const UserScore: React.FC<userRepositoriesProps> = ({ data, user }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    const [scores, setScores] = useState<null | GithubScoreRes>(null);
    const [error, setErrors] = useState<null | AxiosError | ZodError | unknown>(null);

    useEffect(() => {
        titleRef.current && autoAnimate(titleRef.current);
    }, [titleRef]);

    const loadData = () => {
        user.current
            .getUserScores()
            .then(setScores)
            .catch((err) => {
                if (axios.isAxiosError(err)) {
                    if (!err.response?.data) toast.error(t('user.err.ngrok_error'));
                    else toast.error(t('user.err.network_error'));
                } else if (err instanceof BackEndError) toast.error(handleErrorCode(err.response.data.code, t));
                else toast.error(t('errorCode.unknown'));
                setErrors(err);
            });
    };
    useEffect(() => {
        setScores(null);
        setErrors(null);
        const intId = setInterval(() => {
            if (user.current.isFulfilled()) {
                loadData();
                clearInterval(intId);
            }
        }, 1000);
        return () => {
            clearInterval(intId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, user]);
    return (
        <>
            <Card title={t('user.score.title')} data={scores} error={error} reload={loadData} isBackendRequest>
                <LoadingOverlay visible={!scores && !error} loaderProps={{ type: 'dots' }} />
                <div className="flex justify-center">
                    {scores && !error && (
                        <div className="flex flex-row items-stretch justify-around w-full">
                            <div className="flex flex-col gap-8 text-center">
                                <h3 className="text-xl font-bold">{t('user.score.score')}</h3>
                                <p className="text-4xl font-bold m-auto">
                                    {scores.data.totalScore}
                                    <span className="text-xl font-normal ml-3">/100</span>
                                </p>
                            </div>
                            <div className="flex flex-col gap-8 text-center">
                                <h3 className="text-xl font-bold">{t('user.score.score_detail')}</h3>
                                <BarChart
                                    className="m-auto"
                                    h={180}
                                    w={400}
                                    series={[{ name: 'value', color: '#1e90ff' }]}
                                    data={parseData(scores, t)}
                                    withBarValueLabel
                                    dataKey="name"
                                />
                            </div>
                            <div className="flex flex-col gap-8 text-center overflow-visible">
                                <h3 className="text-xl font-bold">{t('user.score.score_proportion')}</h3>
                                <PieChart
                                    w={260}
                                    className="m-auto"
                                    data={parseData(scores, t, true)}
                                    withTooltip
                                    tooltipDataSource="segment"
                                    labelsType="percent"
                                    withLabels
                                    withLabelsLine
                                    labelsPosition="outside"
                                />
                            </div>
                            <div className="flex flex-col gap-8 text-center overflow-visible">
                                <h3 className="text-xl font-bold">{t('user.score.score_radar')}</h3>
                                <RadarChart
                                    h={250}
                                    w={350}
                                    data={parseData(scores, t)}
                                    dataKey="name"
                                    series={[{ name: 'value', color: 'blue.4', opacity: 0.2 }]}
                                    withPolarRadiusAxis
                                    withPolarAngleAxis
                                />
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </>
    );
};

export default UserScore;

const parseData = (res: GithubScoreRes, t: TFunction<'translation', undefined>, ignoreZero: boolean = false) => {
    const { data } = res;
    const scores = [
        { name: t('user.score.commit_score'), value: data.userScore, color: '#1e90ff' },
        { name: t('user.score.repo_score'), value: data.reposScore, color: '#2ed573' },
        { name: t('user.score.prs_score'), value: data.prsScore, color: '#ffa502' },
        { name: t('user.score.issues_score'), value: data.issuesScore, color: '#ff4757' },
    ];

    if (ignoreZero) {
        return scores.filter((score) => score.value !== 0);
    }

    return scores;
};
