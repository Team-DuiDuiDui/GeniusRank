import {
    isRouteErrorResponse,
    ShouldRevalidateFunction,
    useFetcher,
    useLoaderData,
    useRouteError,
} from '@remix-run/react';
import { ActionFunctionArgs, json, LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/cloudflare';
import UserBasic from '~/components/userinfo/basic';
import UserInfoDetail from '~/components/userinfo/detail/info';
import UserIssuesDetail from '~/components/userinfo/detail/issues';
import UserPullRequestsDetail from '~/components/userinfo/detail/prs';
import UserReposContributeDetail from '~/components/userinfo/detail/reposContribute';
import UserReposDetail from '~/components/userinfo/detail/repos';
import { useTranslation } from 'react-i18next';
import UserNation from '~/components/userinfo/region';
import UserScoreDetail from '~/components/userinfo/detail/score';
import { createInstanceForBe } from '~/api/backend/instance';
import { createInstanceForGithub } from '~/api/github/instance';
import { lng, user } from '~/cookie';
import i18nServer from '~/modules/i18n.server';
import { guessRegion } from '~/utils/region/main';
import { UserDetail } from '~/api/github/graphql/typings/user';
import axios from 'axios';
import { gqlUser } from '~/api/github/graphql/gqlUser.server';

export async function loader({ request, params, context }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    const locale = (await lng.parse(cookieHeader)) as string;
    if (!cookie.access_token) return redirect('/unauthorized');
    const t = await i18nServer.getFixedT(request);
    if (params.name) {
        try {
            const githubInstance = createInstanceForGithub(
                cookie.access_token,
                'Team-Duiduidui: Genius Rank',
                'Bearer'
            );
            const user = new gqlUser(
                params.name,
                cookie.access_token,
                context.cloudflare.env.BASE_URL,
                cookie.be_token,
                githubInstance
            );
            const { data } = await user.getData();
            if (!data.user) throw new Response(t('user.err.not_found'), { status: 404 });
            const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL, cookie.be_token);
            let nationData = {
                nationISO: '',
                message: t('user.info.from_followers_and_followings'),
                confidence: 0.5,
            };
            try {
                nationData = await guessRegion({
                    locale,
                    userData: {
                        t,
                        followers: data.user.followers.totalCount,
                        followings: data.user.following.totalCount,
                        login: data.user.login,
                    },
                    beInstance,
                    githubInstance,
                });
                nationData = {
                    ...nationData,
                    confidence: parseFloat(nationData.confidence.toFixed(2)),
                    message: t(nationData.message),
                };
            } catch (e) {
                nationData = {
                    nationISO: '',
                    message: t('user.info.from_followers_and_followings'),
                    confidence: 0,
                };
            }

            const scores = await user.getUserScores();
            return json({
                data,
                title: `${params?.name ?? ''} | Genius Rank`,
                description: t('user.description'),
                beToken: cookie.be_token,
                githubToken: cookie.access_token,
                nationData,
                scores,
            });
        } catch (e) {
            console.log(e);
            if (axios.isAxiosError(e)) {
                if (e.status === 404) throw new Response(t('user.err.not_found'), { status: 404 });
                if (e.status === 403) {
                    throw new Response(t('user.err.rate_limit'), { status: 403 });
                } else throw new Response(t('user.err.something_wrong'), { status: 500 });
            } else if (e instanceof Response) throw e;
            else {
                console.log(e);
                throw new Response(t('user.err.something_wrong'), { status: 500 });
            }
        }
    }
    return redirect('/');
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};

export default function User() {
    const data = useLoaderData<typeof loader>();
    const { t } = useTranslation();
    const { user } = data.data;
    const fetcher = useFetcher<typeof action>();
    const isStillHim = fetcher.data?.login === user.login;
    return (
        <>
            <div className="flex items-center justify-center w-full mt-5 z-0">
                <div className="flex flex-row items-center gap-16 w-full h-full justify-center relative">
                    <UserBasic>
                        <div className="flex gap-4 w-full h-40 items-start">
                            <UserInfoDetail data={user} />
                            <UserNation
                                fetcher={fetcher}
                                userData={{ followers: user.followers, following: user.following, login: user.login }}
                                nationISO={(isStillHim && fetcher.data?.nationISO) || data.nationData.nationISO}
                                nationLocale={t(
                                    `country.${(isStillHim && fetcher.data?.nationISO) || data.nationData.nationISO}`
                                )}
                                confidence={(isStillHim && fetcher.data?.confidence) || data.nationData.confidence}
                                message={
                                    <div className="flex flex-col items-center justify-center">
                                        <span>{(isStillHim && fetcher.data?.message) || data.nationData.message}</span>
                                        <span>
                                            {t('user.confidence')}:{' '}
                                            {(isStillHim && fetcher.data?.confidence) || data.nationData.confidence}
                                        </span>
                                    </div>
                                }
                            />
                        </div>
                        <UserScoreDetail scores={data.scores} />
                        <UserReposDetail data={user} />
                        <UserReposContributeDetail data={user} />
                        <UserPullRequestsDetail data={user} />
                        <UserIssuesDetail data={user} />
                    </UserBasic>
                </div>
            </div>
        </>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        if (error.status === 404)
            return (
                <div>
                    <div>{error.data}</div>
                </div>
            );
        else
            return (
                <div>
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

export async function action({ request, context }: ActionFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    const githubInstance = createInstanceForGithub(cookie.access_token, 'Team-Duiduidui: Genius Rank', 'Bearer');
    const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL, cookie.be_token);
    const t = await i18nServer.getFixedT(request);
    const body = await request.formData();
    const stringUserData = body.get('userData')?.toString();
    const locale = (await lng.parse(cookieHeader)) as string;
    if (body.get('reload-nation') === 'reload' && stringUserData) {
        const userData = JSON.parse(stringUserData) as Pick<UserDetail, 'followers' | 'following' | 'login'>;
        try {
            const nationData = await guessRegion({
                locale,
                userData: {
                    t,
                    followers: userData.followers.totalCount,
                    followings: userData.following.totalCount,
                    login: userData.login,
                },
                beInstance,
                githubInstance,
            });
            return json({ ...nationData, message: t(nationData.message), donotLoad: true });
        } catch (e) {
            const nationData = {
                nationISO: '',
                nationName: '',
                message: t('user.info.from_followers_and_followings'),
                confidence: 0.5,
                login: userData.login,
            };
            return json({ ...nationData, donotLoad: true });
        }
    }
    const nationData = {
        nationISO: '',
        nationName: '',
        message: t('user.info.from_followers_and_followings'),
        confidence: 0.5,
        login: 'unknown',
    };
    return json({ ...nationData, donotLoad: true });
}

/** 阻止 Action 触发 Loader */
export const shouldRevalidate: ShouldRevalidateFunction = ({ actionResult, defaultShouldRevalidate }) => {
    if (actionResult?.donotLoad) {
        return false;
    }
    return defaultShouldRevalidate;
};
