import { Select } from '@mantine/core';
import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { isRouteErrorResponse, useLoaderData, useRouteError, useSearchParams } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { createInstanceForBe } from '~/api/backend/instance';
import { RankResp } from '~/api/backend/typings/beRes';
import LoadingLayout from '~/components/loading';
import { UserAccordion, UserCard } from '~/components/ranking/card';
import i18nServer from '~/modules/i18n.server';
import { getRankings } from '~/api/backend/ranking';
import { user } from '~/cookie';
import axios from 'axios';
import { BackEndError } from '~/hooks/useAxiosInstanceForBe';
export async function loader({ request, context }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const nation = url.searchParams.get('nation');
    const cookieHeader = request.headers.get('Cookie');
    const userCookie = (await user.parse(cookieHeader)) || {};
    const userData = {
        login: userCookie.userLogin,
        name: userCookie.username,
        avatar_url: userCookie.userAvatar,
    } as {
        login: string;
        avatar_url: string;
        name?: string | null;
    };
    const type = url.searchParams.get('type');
    const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL);
    const t = await i18nServer.getFixedT(request);
    try {
        const res = await getRankings(beInstance, nation, type, 20);
        return json(
            {
                userData: userData,
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
    const rankingData: RankResp[] = JSON.parse(JSON.stringify(loaderData.ranking.resp));
    const splicedData = (rankingData && rankingData.splice(0, Math.ceil(loaderData.ranking.resp.length / 2))) || '';
    return (
        <div className="my-12 mx-0 sm:mx-8 relative">
            <LoadingLayout />
            <div className="flex justify-center">
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
                        data={loaderData.ranking.nations.map((item) => {
                            return {
                                label: t(`country.${item.toUpperCase()}`),
                                value: item,
                            };
                        })}
                        searchable
                        clearable
                    />
                </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-around items-center lg:items-start mt-8 w-screen sm:w-auto">
                <UserAccordion>
                    {splicedData &&
                        splicedData.map((item, index) => <UserCard key={index} userInfo={item} score={item} />)}
                </UserAccordion>
                <UserAccordion>
                    {rankingData &&
                        rankingData.map((item, index) => <UserCard key={index} userInfo={item} score={item} />)}
                </UserAccordion>
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (
            <div className="flex justify-center items-center my-12">
                <p>{error.data}</p>
            </div>
        );
    } else if (error instanceof Error) {
        return (
            <div>
                <h1>错误</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}
