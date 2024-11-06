import { Select } from '@mantine/core';
import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { createInstanceForBe } from '~/api/instance';
import { ScoreRankResp } from '~/api/typings/beRes';
import LoadingLayout from '~/components/loading';
import { UserAccordion, UserCard } from '~/components/ranking/card';
import i18nServer from '~/modules/i18n.server';
import { getRankings } from '~/api/ranking';
import { user } from '~/cookie';
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
    }
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
        throw new Response(
            JSON.stringify({
                code: 'error',
                data: null,
                // message: e.message,
                success: false,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};

export default function Ranking() {
    const loaderData = useLoaderData<typeof loader>();
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useTranslation();
    const rankingData: ScoreRankResp[] = JSON.parse(JSON.stringify(loaderData.ranking));
    const splicedData = rankingData.splice(0, Math.ceil(loaderData.ranking.length / 2));
    return (
        <div className="my-12 mx-32 relative">
            <LoadingLayout />
            <div className="flex justify-between">
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
                    data={['Java', 'JavaScript', 'Python', 'Golang', 'TypeScript', 'Rust', 'C']}
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
                    data={['China', 'US']}
                    searchable
                    clearable
                />
            </div>
            {/* <UserCard userInfo={loaderData.userData} score={
                {
                    rank: 0,
                    login: loaderData.userData.login,
                    avatar_url: loaderData.userData.avatar_url,
                    name: loaderData.userData.name,
                }
            } /> */}
            </div>
            <div className="flex flex-row justify-between mt-8">
                <UserAccordion>
                    {splicedData.map((item, index) => (
                        <UserCard key={index} userInfo={item} score={item} />
                    ))}
                </UserAccordion>
                <UserAccordion>
                    {rankingData.map((item, index) => (
                        <UserCard key={index} userInfo={item} score={item} />
                    ))}
                </UserAccordion>
            </div>
        </div>
    );
}
