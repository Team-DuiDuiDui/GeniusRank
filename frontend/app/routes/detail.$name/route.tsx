import { loader } from './loader';
import {
    isRouteErrorResponse,
    ShouldRevalidateFunction,
    useFetcher,
    useLoaderData,
    useRouteError,
} from '@remix-run/react';
import { ActionFunctionArgs, json, MetaFunction } from '@remix-run/cloudflare';
import UserBasic from '~/components/userinfo/basic';
import UserInfoDetail from '~/components/userinfo/detail/info';
import UserIssuesDetail from '~/components/userinfo/detail/issues';
import UserPullRequestsDetail from '~/components/userinfo/detail/prs';
import UserReposContributeDetail from '~/components/userinfo/detail/reposContribute';
import UserReposDetail from '~/components/userinfo/detail/repos';
import { useTranslation } from 'react-i18next';
import UserNation from '~/components/userinfo/region';

import UserScoreDetail from '~/components/userinfo/detail/score';
import { createInstanceForBe } from '~/api/instance';
import { createInstanceForGithub } from '~/utils/requests/instance';
import { lng, user } from '~/cookie';
import i18nServer from '~/modules/i18n.server';
import { guessRegion } from '~/utils/region/main';
import { UserDetail } from '~/utils/requests/ghGraphql/typings/user';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};

export { loader };

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
