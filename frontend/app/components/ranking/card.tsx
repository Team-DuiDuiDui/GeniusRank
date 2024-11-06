import { LinkOutlined } from '@ant-design/icons';
import { BarChart } from '@mantine/charts';
import { Accordion, Avatar } from '@mantine/core';
import { Link } from '@remix-run/react';
import { GithubScoreRes } from '~/api/typings/beRes';
import { interpolateColorsOfScore } from '~/utils/chore';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

interface UserCardProps {
    userInfo: {
        login: string;
        avatar_url: string;
        name?: string | null;
    };
    score: Omit<GithubScoreRes['data'], 'updateTime'>;
}

const UserCard: React.FC<UserCardProps> = ({ userInfo, score }) => {
    const { r, g, b } = interpolateColorsOfScore(score.totalScore);
    const { t } = useTranslation();

    return (
        <Accordion.Item value={userInfo.login} className="bg-white">
            <Accordion.Control icon={<Avatar src={userInfo.avatar_url} />}>
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-center h-12">
                        <div className="flex flex-col">
                            <div className="text-xl font-bold">{userInfo.name ?? userInfo.login}</div>
                            {userInfo.name && <div className="text-sm text-gray-500">{userInfo.login}</div>}
                        </div>
                    </div>
                    <div className="ml-auto flex flex-row items-center justify-around mx-5 gap-4">
                        <span style={{ color: `rgb(${r}, ${g}, ${b})` }} className="text-3xl w-14">
                            {rankIt(score.totalScore)}
                            <sup className="text-base align-top">{score.totalScore}</sup>
                        </span>
                        <Link
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                            to={`/user/${userInfo.login}`}
                            className="hover:bg-gray-300 p-2 rounded-md transition-all">
                            <LinkOutlined className="text-2xl text-gray-900" />
                        </Link>
                    </div>
                </div>
            </Accordion.Control>
            <Accordion.Panel>
                <div className="flex flex-col md:flex-row gap-6 py-7">
                    <p className="text-4xl font-bold m-auto">
                        {score.totalScore}
                        <span className="text-xl font-normal ml-3">/100</span>
                    </p>
                    <BarChart
                        className="m-auto"
                        h={180}
                        w={300}
                        series={[{ name: 'value', color: '#1e90ff' }]}
                        data={parseScoreData(score, t)}
                        withBarValueLabel
                        dataKey="name"
                    />
                </div>
            </Accordion.Panel>
        </Accordion.Item>
    );
};

const UserAccordion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Accordion
            className="w-10/12 min-w-[375px] md:min-w-[511px] md:w-1/2 lg:w-1/3 bg-white box-border"
            variant="contained"
            radius="lg">
            {children}
        </Accordion>
    );
};

const UserCardFull: React.FC<UserCardProps> = ({ userInfo, score }) => {
    return (
        <UserAccordion>
            <UserCard userInfo={userInfo} score={score} />
        </UserAccordion>
    );
};

export { UserCard, UserAccordion, UserCardFull };

const parseScoreData = (
    data: Omit<GithubScoreRes['data'], 'updateTime'>,
    t: TFunction<'translation', undefined>,
    ignoreZero: boolean = false
) => {
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

export const rankIt = (score: number): string => {
    if (score >= 75) return 'A';
    else if (score >= 50) return 'B';
    else if (score >= 25) return 'C';
    else return 'D';
};
