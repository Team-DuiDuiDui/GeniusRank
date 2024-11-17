import { Avatar, Select } from '@mantine/core';
import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { Link, ShouldRevalidateFunction, useLoaderData, useRouteError, useSearchParams } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { createInstanceForBe } from '~/api/backend/instance';
import { RankResp } from '~/api/backend/typings/beRes';
import LoadingLayout from '~/components/loading';
import { rankIt, UserAccordion, UserCard } from '~/components/ranking/card';
import i18nServer from '~/modules/i18n.server';
import { getRankings, getUserRanking } from '~/api/backend/ranking';
import { user } from '~/cookie';
import axios from 'axios';
import { BackEndError } from '~/hooks/useAxiosInstanceForBe';
import { LinkOutlined } from '@ant-design/icons';
import { interpolateColorsOfScore } from '~/utils/color';
import ErrorHandle from '~/components/errorHandle';
export async function loader({ request, context }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const nation = url.searchParams.get('nation');
    const cookieHeader = request.headers.get('Cookie');
    const t = await i18nServer.getFixedT(request);
    const userCookie = (await user.parse(cookieHeader)) || {};
    const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL);
    const userInfo = {
        login: userCookie.userLogin,
        name: userCookie.username,
        avatar_url: userCookie.userAvatar,
        rankingInfo: await getUserRanking(beInstance, userCookie.userLogin).catch(() => undefined),
        // rankingInfo: { rank: 9, score: 17 },
    } as {
        login: string;
        avatar_url: string;
        name?: string | null;
        rankingInfo: { rank: number; score: number } | undefined;
    };
    const type = url.searchParams.get('type');
    try {
        const res = await getRankings(beInstance, nation, type, 20);
        return json(
            {
                userInfo,
                ranking: res,
                title: `${t('ranking.title')} | Genius Rank`,
                description: t('ranking.description'),
                type,
                nation,
            },
            { status: 200 }
        );
    } catch (e) {
        if (axios.isAxiosError(e)) throw new Response(t('ranking.err.ngrok_error'), { status: e.status });
        if (e instanceof BackEndError) throw new Response(t('ranking.err.error'), { status: e.response?.status });
        throw new Response(t('ranking.err.error'), { status: 500 });
    }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};

export default function Ranking() {
    const loaderData = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();
    const userInfo = loaderData.userInfo;
    const rankingData: RankResp[] = JSON.parse(JSON.stringify(loaderData.ranking.resp));
    const splicedData = (rankingData && rankingData.splice(0, Math.ceil(loaderData.ranking.resp.length / 2))) || '';

    const renderUserInfo = () => {
        let noData = true;
        let userData = { score: 39, rank: 39 };
        let color = interpolateColorsOfScore(39);
        if (userInfo.rankingInfo?.score) {
            userData = userInfo.rankingInfo;
            color = interpolateColorsOfScore(userData.score);
            noData = false;
        }
        return (
            <>
                {noData && (
                    <div className=" absolute top-0 left-0 w-full h-full flex justify-center items-center z-10 bg-white/30">
                        <div className="text-base whitespace-nowrap">{t('user.info.no_ranking_data_l1')}</div>
                        <a
                            href={`/detail/${userInfo.login}`}
                            className=" drop-shadow-lg mx-2 text-blue-400 text-xl font-semibold">
                            {t('user.info.no_ranking_data_l2')}
                        </a>
                        <div className="text-base whitespace-nowrap">{t('user.info.no_ranking_data_l3')}</div>
                    </div>
                )}
                <div className={`${noData ? 'blur-sm' : ''} flex flex-row items-center justify-between`}>
                    <div className="flex gap-2 items-center">
                        <Avatar src={userInfo.avatar_url} />
                        <div className="flex flex-row items-center h-12">
                            <div className="flex flex-col">
                                <div className="text-xl font-bold">{userInfo.name ?? userInfo.login}</div>
                                {userInfo.name && <div className="text-sm text-gray-500">{userInfo.login}</div>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="font-bold text-2xl">#</span>
                        <span
                            className="font-bold text-lg"
                            style={{ color: `rgb(${color.r}, ${color.g}, ${color.b})` }}>
                            {userData.rank}
                        </span>
                    </div>
                    <span style={{ color: `rgb(${color.r}, ${color.g}, ${color.b})` }} className="text-3xl w-14">
                        {rankIt(userData.score)}
                        <sup className="text-base align-top">{userData.score}</sup>
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
            </>
        );
    };

    return (
        <div className="my-12 mx-0 sm:mx-8 relative flex justify-center flex-col items-center">
            <LoadingLayout />
            <div
                className={`flex ${
                    loaderData.userInfo.login ? 'justify-between' : 'justify-center'
                }  items-center relative w-full`}>
                {loaderData.userInfo.login && (
                    <div className="max-w-2/5 w-auto min-w-[200px] md:min-w-[300px] md:w-1/6 lg:w-1/4 gap-4 right-4 relative p-3"></div>
                )}
                <div className="flex flex-row justify-start gap-8">
                    <Select
                        onChange={(value) => {
                            setSearchParams({
                                ...(value && { type: value ?? '' }),
                                ...(searchParams.get('nation') && { nation: searchParams.get('nation') ?? '' }),
                            });
                        }}
                        defaultValue={loaderData.type}
                        placeholder={t('ranking.type')}
                        data={loaderData.ranking.types}
                        searchable
                        clearable
                    />
                    <Select
                        onChange={(value) => {
                            setSearchParams({
                                ...(value !== null && { nation: value ?? '' }),
                                ...(searchParams.get('nation') !== null && { type: searchParams.get('type') ?? '' }),
                            });
                        }}
                        defaultValue={loaderData.type}
                        placeholder={t('ranking.nation')}
                        data={loaderData.ranking.nations
                            .map((item) => {
                                if (item.toUpperCase() !== 'NULL')
                                    return {
                                        label: t(`country.${item.toUpperCase()}`),
                                        value: item,
                                    };
                            })
                            .filter((item): item is { label: string; value: string } => item !== undefined)}
                        searchable
                        clearable
                    />
                </div>
                {loaderData.userInfo.login && (
                    <div className="max-w-2/5 w-auto min-w-[200px] md:min-w-[300px] md:w-1/6 lg:w-1/4 gap-4 right-4 border relative rounded-2xl border-slate-300 p-3">
                        {renderUserInfo()}
                    </div>
                )}
            </div>
            <div className="flex w-full flex-col lg:flex-row justify-around items-center lg:items-start mt-8">
                <UserAccordion>
                    {splicedData &&
                        splicedData.map((item, index) => <UserCard key={index} userInfo={item} score={item} />)}
                </UserAccordion>
                <UserAccordion>
                    {rankingData &&
                        rankingData.map((item, index) => <UserCard key={index} userInfo={item} score={item} />)}
                </UserAccordion>
            </div>
            <div className="flex gap-2 items-center mt-20">
                <span className="text-slate-600 dark:text-gray-300 text-base">{t('user.info.total_users_l1')}</span>
                <span className="text-slate-900 dark:text-gray-200 text-xl">{loaderData.ranking.totalCount}</span>
                <span className="text-slate-600 dark:text-gray-300 text-base">{t('user.info.total_users_l2')}</span>
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    return <ErrorHandle error={error} />;
}

export const shouldRevalidate: ShouldRevalidateFunction = ({ actionResult, defaultShouldRevalidate }) => {
    if (actionResult?.donotLoad) {
        return false;
    }
    return defaultShouldRevalidate;
};
