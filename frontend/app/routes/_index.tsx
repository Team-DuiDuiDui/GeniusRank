import { Button } from '@mantine/core';
import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { createInstanceForBe } from '~/api/backend/instance';
import { getRankings } from '~/api/backend/ranking';
import LoadingLayout from '~/components/loading';
import { user } from '~/cookie';
import i18nServer from '~/modules/i18n.server';
import { RankResp } from '~/api/backend/typings/beRes';
import { useEffect } from 'react';
import { UserCardFull } from '~/components/ranking/card';
export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title }, { name: 'description', content: data?.description }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    const cookieHeader = request.headers.get('Cookie');
    const userCookie = (await user.parse(cookieHeader)) || {};
    const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL, userCookie.be_token);
    console.log(Date.now());
    try {
        const rankingData = await getRankings(beInstance, null, null, 21);
        return json({ title: t('title'), description: t('user.description'), rankingData }, { headers: { 'Cache-Control': 'public, max-age=86400' } });
    } catch {
        return json({ title: t('title'), description: t('user.description'), rankingData: fallBackData }, { headers: { 'Cache-Control': 'public, max-age=86400' } });
    }
}

export default function Index() {
    const { t } = useTranslation();
    const data = useLoaderData<typeof loader>();
    const rankingData: RankResp[] = JSON.parse(JSON.stringify(data.rankingData.resp));
    const rankingDataList: RankResp[][] = [];
    const length = rankingData.length;
    for (let i = 0; i < length; i += length / 3) {
        const data = rankingData.slice(i, i + length / 3);
        rankingDataList.push([...data, ...data]);
    }
    useEffect(() => {
        const scrollContentLine1 = Array.from(document.querySelectorAll('.scrollLineO'));
        const scrollContentLine2 = Array.from(document.querySelectorAll('.scrollLineI'));
        const scrollContent = [...scrollContentLine1, ...scrollContentLine2];

        const listener = () => {
            if (document.visibilityState === 'visible') {
                scrollContent.forEach((element) => ((element as HTMLElement).style.animationPlayState = 'running'));
            } else {
                scrollContent.forEach((element) => ((element as HTMLElement).style.animationPlayState = 'paused'));
            }
        };

        document.addEventListener('visibilitychange', listener, false);
        return () => {
            document.removeEventListener('visibilitychange', listener, false);
        };
    }, []);

    return (
        <>
            <div className="px-8 py-12 bg-blue-400/70 text-white flex flex-col justify-center items-center gap-2 relative">
                <LoadingLayout />
                <h1 className="text-6xl font-bold">Genius Rank</h1>
                <h2 className="text-2xl">{t('description')}</h2>
                <div className="flex flex-row gap-7">
                    <Link to="/user">
                        <Button size="md" className="mt-4">
                            {t('lookup_docs')}
                        </Button>
                    </Link>
                    <Link to="/ranking">
                        <Button variant="default" size="md" className="mt-4">
                            {t('see_ranking')}
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-row flex-wrap h-max flex-grow py-20">
                {rankingDataList.slice(0, 15).map((data, lineIndex) => (
                    <div key={lineIndex} className={`flex overflow-auto relative width-auto gap-4 scrollbarHidden`}>
                        {data.map((item, index) => (
                            <UserCardFull
                                key={index}
                                userInfo={item}
                                score={item}
                                style={{
                                    animation: `${lineIndex % 2 ? 'scrollLineO' : 'scrollLineI'} 90s linear infinite ${lineIndex % 2 ? 'reverse' : ''
                                        }`,
                                }}
                                disabledChevron
                                disabled
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}

const fallBackData = {
    resp: [
        {
            login: 'karpathy',
            name: 'Andrej',
            avatar_url: 'https://avatars.githubusercontent.com/u/241138?u=05376db54475c3d23b3a409f4c47d14c4855dc28&v=4',
            country_iso: null,
            totalScore: 82.43,
            userScore: 25.85,
            reposScore: 42.31,
            prsScore: 11.78,
            issuesScore: 2.49,
        },
        {
            login: 'ruanyf',
            name: 'Ruan YiFeng',
            avatar_url: 'https://avatars.githubusercontent.com/u/905434?v=4',
            country_iso: null,
            totalScore: 69.01,
            userScore: 21.79,
            reposScore: 41.66,
            prsScore: 0.91,
            issuesScore: 4.65,
        },
        {
            login: 'torvalds',
            name: 'Linus Torvalds',
            avatar_url: 'https://avatars.githubusercontent.com/u/1024025?v=4',
            country_iso: 'US',
            totalScore: 67.12,
            userScore: 8,
            reposScore: 31.4,
            prsScore: 21.71,
            issuesScore: 6.01,
        },
        {
            login: 'microsoft',
            name: 'Microsoft',
            avatar_url: null,
            country_iso: null,
            totalScore: 55,
            userScore: 10,
            reposScore: 45,
            prsScore: 0,
            issuesScore: 0,
        },
        {
            login: 'yyx990803',
            name: 'Evan You',
            avatar_url: 'https://avatars.githubusercontent.com/u/499550?u=dd9a9ba40daf29be7c310f7075e74251609b03f3&v=4',
            country_iso: 'CN',
            totalScore: 52.19,
            userScore: 8,
            reposScore: 11.85,
            prsScore: 23.49,
            issuesScore: 8.85,
        },
        {
            login: 'afc163',
            name: 'afc163',
            avatar_url: 'https://avatars.githubusercontent.com/u/507615?u=63a8ef8e8876c4c1fad07a7737684f5281fedaaa&v=4',
            country_iso: null,
            totalScore: 52.16,
            userScore: 8,
            reposScore: 13.19,
            prsScore: 22.44,
            issuesScore: 8.53,
        },
        {
            login: 'gaearon',
            name: 'dan',
            avatar_url: 'https://avatars.githubusercontent.com/u/810438?u=9a342ce34340637775698b6391d1c77f1a911f5b&v=4',
            country_iso: null,
            totalScore: 51.18,
            userScore: 8,
            reposScore: 10,
            prsScore: 27.38,
            issuesScore: 5.8,
        },
        {
            login: 'dg',
            name: 'David Grudl',
            avatar_url: 'https://avatars.githubusercontent.com/u/194960?v=4',
            country_iso: 'CZ',
            totalScore: 37.3,
            userScore: 6.74,
            reposScore: 8.06,
            prsScore: 15.61,
            issuesScore: 6.89,
        },
        {
            login: 'peng-zhihui',
            name: '稚晖',
            avatar_url:
                'https://avatars.githubusercontent.com/u/12994887?u=6bfec84cb512892557cfed7fd7c52b0b0f41f95b&v=4',
            country_iso: null,
            totalScore: 32.85,
            userScore: 8,
            reposScore: 9.17,
            prsScore: 12.8,
            issuesScore: 2.88,
        },
        {
            login: 'd',
            name: 'Jesse Zhang',
            avatar_url: 'https://avatars.githubusercontent.com/u/440892?v=4',
            country_iso: 'CN',
            totalScore: 26.57,
            userScore: 2.99,
            reposScore: 15.68,
            prsScore: 6.21,
            issuesScore: 1.69,
        },
        {
            login: 'FuzzyFade',
            name: 'Rhuzerv',
            avatar_url:
                'https://avatars.githubusercontent.com/u/25416941?u=37f6268a5ff66712fc32d053e9a6d24c953e5d70&v=4',
            country_iso: null,
            totalScore: 26.09,
            userScore: 1.35,
            reposScore: 8.15,
            prsScore: 13.85,
            issuesScore: 2.74,
        },
        {
            login: 'gustavoguanabara',
            name: 'Gustavo Guanabara',
            avatar_url:
                'https://avatars.githubusercontent.com/u/8683378?u=01b06a154f04dadaa4e4131497fa2442e6323cbc&v=4',
            country_iso: null,
            totalScore: 19.4,
            userScore: 8,
            reposScore: 10.08,
            prsScore: 0,
            issuesScore: 1.32,
        },
        {
            login: 'NEKO-CwC',
            name: 'NEKO-CwC',
            avatar_url:
                'https://avatars.githubusercontent.com/u/146005314?u=dd8778b1918dbb8d3f052a7049cdf0e57ac352e1&v=4',
            country_iso: 'NULL',
            totalScore: 17.71,
            userScore: 0.16,
            reposScore: 7.7,
            prsScore: 1.84,
            issuesScore: 8.01,
        },
        {
            login: 'INDIAN2020',
            name: 'Gogula Sivannarayana',
            avatar_url:
                'https://avatars.githubusercontent.com/u/3226765?u=f5939557f4f4bc14bc1de87c5c2501f45577c13f&v=4',
            country_iso: 'IN',
            totalScore: 13.82,
            userScore: 0.41,
            reposScore: 8.02,
            prsScore: 0,
            issuesScore: 5.39,
        },
        {
            login: 'Heuluck',
            name: 'Heuluck Lu',
            avatar_url:
                'https://avatars.githubusercontent.com/u/89375068?u=7df7cd11ca5f1822ada8588cdc56af92664f1a92&v=4',
            country_iso: null,
            totalScore: 8.55,
            userScore: 0.24,
            reposScore: 7.5,
            prsScore: 0.81,
            issuesScore: 0,
        },
        {
            login: 'EST-NINE',
            name: 'EST-NINE',
            avatar_url:
                'https://avatars.githubusercontent.com/u/143050853?u=51c7c5d63f4f5cb24902d1a7639db930effc5f36&v=4',
            country_iso: 'CN',
            totalScore: 8.45,
            userScore: 7.58,
            reposScore: 0.07,
            prsScore: 0.8,
            issuesScore: 0,
        },
    ],
    nations: ['CN', 'US', 'NULL', 'FI', 'CZ', 'CH', 'IN'],
    types: [
        'TypeScript',
        'Go',
        'Python',
        'JavaScript',
        'Java',
        'HTML',
        'CSS',
        'C++',
        'Vue',
        'C',
        'Shell',
        'PHP',
        'Latte',
        'Jupyter Notebook',
        'Ruby',
    ],
    totalCount: 16,
};
