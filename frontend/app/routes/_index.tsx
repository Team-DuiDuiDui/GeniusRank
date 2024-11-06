import { Button } from '@mantine/core';
import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
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
    const rankingData = await getRankings(beInstance, null, null, 21);
    return json({ title: t('title'), description: t('user.description'), rankingData });
}

export default function Index() {
    const { t } = useTranslation();
    const data = useLoaderData<typeof loader>();
    const rankingData: RankResp[] = JSON.parse(JSON.stringify(data.rankingData.resp));
    console.log(rankingData)
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
                <Button variant="default" size="md" className="mt-4">
                    {t('lookup_docs')}
                </Button>
            </div>
            <div className="flex flex-row flex-wrap h-max flex-grow py-20">
                {rankingDataList.map((data, lineIndex) => (
                    <div key={lineIndex} className={`flex overflow-auto relative width-auto gap-4 scrollbarHidden`}>
                        {data.map((item, index) => (
                            <UserCardFull
                                key={index}
                                userInfo={item}
                                score={item}
                                style={{
                                    animation: `${lineIndex % 2 ? 'scrollLineO' : 'scrollLineI'} 60s linear infinite`,
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
