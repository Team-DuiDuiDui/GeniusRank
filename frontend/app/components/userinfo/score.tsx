import { useTranslation } from 'react-i18next';
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ZodError } from 'zod';
import axios, { AxiosError } from 'axios';
import { githubUser } from '~/api/github/rest/user';
import { User } from '~/api/github/rest/typings/user';
import { Card } from './card';
import toast from 'react-hot-toast';
import { BackEndError } from '~/hooks/useAxiosInstanceForBe';
import handleErrorCode from '~/utils/handleErrorCode';
import { LoadingOverlay, Tooltip, CopyButton } from '@mantine/core';
import { BarChart, PieChart, RadarChart } from '@mantine/charts';
import { TFunction } from 'i18next';
import { GithubScoreRes } from '~/api/backend/typings/beRes';
import { CheckOutlined, CopyOutlined, LinkOutlined } from '@ant-design/icons';
import { ClientOnly } from 'remix-utils/client-only';

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
            <Card title={t('user.score.title_detail')} data={scores} error={error} reload={loadData} isBackendRequest>
                <LoadingOverlay visible={!scores && !error} loaderProps={{ type: 'dots' }} />
                <div className="flex justify-center">
                    {scores && !error && <UserScoreCharts scores={scores} t={t} />}
                </div>
                {scores && !error && (
                    <div className="flex justify-end items-center p-2 gap-2">
                        <p className="border border-gray-500 rounded-md overflow-hidden w-fit flex flex-row">
                            <span className="bg-gray-200 px-4 flex items-center text-gray-700">
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
                                            className="text-lg px-3 aspect-square hover:bg-gray-200 active:bg-gray-300 transition-all rounded-md">
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
                                    className="text-lg px-3 aspect-square hover:bg-gray-200 active:bg-gray-300 transition-all flex items-center justify-center rounded-md">
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

export default UserScore;

export const UserScoreCharts: React.FC<{ scores: GithubScoreRes; t: TFunction<'translation', undefined> }> = ({
    scores,
    t,
}) => {
    const data = useMemo(() => {
        return parseScoreData(scores, t);
    }, [scores, t]);
    return (
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
                <ClientOnly>
                    {() => (
                        <BarChart
                            className="m-auto"
                            h={180}
                            w={400}
                            series={[{ name: 'value', color: '#1e90ff' }]}
                            data={data}
                            withBarValueLabel
                            dataKey="name"
                        />
                    )}
                </ClientOnly>
            </div>
            <div className="flex flex-col gap-8 text-center overflow-visible">
                <h3 className="text-xl font-bold">{t('user.score.score_proportion')}</h3>
                <ClientOnly>
                    {() => (
                        <PieChart
                            w={260}
                            className="m-auto"
                            data={parseScoreData(scores, t, true)}
                            withTooltip
                            tooltipDataSource="segment"
                            labelsType="percent"
                            withLabels
                            withLabelsLine
                            labelsPosition="outside"
                        />
                    )}
                </ClientOnly>
            </div>
            <div className="flex flex-col gap-8 text-center overflow-visible">
                <h3 className="text-xl font-bold">{t('user.score.score_radar')}</h3>
                <ClientOnly>
                    {() => (
                        <RadarChart
                            h={250}
                            w={350}
                            data={data}
                            dataKey="name"
                            series={[{ name: 'value', color: 'blue.4', opacity: 0.2 }]}
                            withPolarRadiusAxis
                            withPolarAngleAxis
                        />
                    )}
                </ClientOnly>
            </div>
        </div>
    );
};

export const parseScoreData = (
    res: GithubScoreRes,
    t: TFunction<'translation', undefined>,
    ignoreZero: boolean = false
) => {
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
