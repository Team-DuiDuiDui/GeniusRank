import { LinkOutlined } from '@ant-design/icons';
import { BarChart } from '@mantine/charts';
import { Accordion, Avatar } from '@mantine/core';
import { Link } from '@remix-run/react';
import { GithubScoreRes } from '~/api/typings/beRes';
import { interpolateColorsOfScore } from '~/utils/chore';
import { parseScoreData } from '../userinfo/score';
import { useTranslation } from 'react-i18next';

interface UserCardProps {
    userInfo: {
        login: string;
        avatar: string;
        name?: string;
    };
    score: GithubScoreRes;
}

const UserCard: React.FC<UserCardProps> = ({ userInfo, score }) => {
    const { r, g, b } = interpolateColorsOfScore(score.data.userScore);
    const { t } = useTranslation();

    return (
        <Accordion
            className="w-10/12 min-w-[375px] md:min-w-[511px] md:w-1/2 lg:w-1/3 bg-white box-border"
            variant="contained"
            radius="lg">
            <Accordion.Item value={userInfo.login} className="bg-white">
                <Accordion.Control icon={<Avatar src={userInfo.avatar} />} className="px-6">
                    <div className="flex flex-row items-center justify-around">
                        <div className="flex flex-row items-center">
                            <div className="flex flex-col">
                                <div className="text-xl font-bold">{userInfo.name ?? userInfo.login}</div>
                                {userInfo.name && <div className="text-sm text-gray-500">{userInfo.login}</div>}
                            </div>
                        </div>
                        <div className="ml-auto flex flex-row items-center justify-around mx-5 gap-4">
                            <span style={{ color: `rgb(${r}, ${g}, ${b})` }} className="text-3xl">
                                A<sup className="text-base align-top">{score.data.userScore}</sup>
                            </span>
                            <Link
                                to={`/user/${userInfo.login}`}
                                className="hover:bg-gray-300 p-2 rounded-md transition-all">
                                <LinkOutlined className="text-2xl text-gray-900" />
                            </Link>
                        </div>
                    </div>
                </Accordion.Control>
                <Accordion.Panel>
                    <div className="flex flex-col md:flex-row gap-6">
                        <p className="text-4xl font-bold m-auto">
                            {score.data.totalScore}
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
        </Accordion>
    );
};

export default UserCard;
