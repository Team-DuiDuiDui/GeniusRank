import { Select } from '@mantine/core';
import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { createInstanceForBe } from '~/api/instance';
import { ScoreRankResp } from '~/api/typings/beRes';
import { UserAccordion, UserCard } from '~/components/ranking/card';
import i18nServer from '~/modules/i18n.server';
import { getRankings } from '~/utils/requests/ranking';
export async function loader({ request, context }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const nation = url.searchParams.get('nation');
    const type = url.searchParams.get('type');
    const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL);
    const t = await i18nServer.getFixedT(request);
    try {
        const res = await getRankings(beInstance, nation, type, 20);
        return json(
            {
                ranking: res.data,
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
    const rankingData: ScoreRankResp[] = JSON.parse(JSON.stringify(loaderData.ranking.data));
    const splicedData = rankingData.splice(0, Math.ceil(loaderData.ranking.data.length / 2));
    return (
        <div className="my-12 mx-32">
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
