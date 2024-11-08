import {
    isRouteErrorResponse,
    ShouldRevalidateFunction,
    useFetcher,
    useLoaderData,
    useRouteError,
} from '@remix-run/react';
import { MetaFunction } from '@remix-run/cloudflare';
import UserBasic from '~/components/userinfo/basic';
import UserInfoDetail from '~/components/userinfo/detail/info';
import UserIssuesDetail from '~/components/userinfo/detail/issues';
import UserPullRequestsDetail from '~/components/userinfo/detail/prs';
import UserReposContributeDetail from '~/components/userinfo/detail/reposContribute';
import UserReposDetail from '~/components/userinfo/detail/repos';
import { useTranslation } from 'react-i18next';
import UserNation from '~/components/userinfo/region';
import UserScoreDetail from '~/components/userinfo/detail/score';
import loader from './loader';
import action from './action';


export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};

export { loader, action }

export default function User() {
    const data = useLoaderData<typeof loader>();
    const { t } = useTranslation();
    const { user } = data.data;
    const fetcher = useFetcher<typeof action>();
    const isStillHim = fetcher.data?.login === user.login;
    return (
        <>
            <div className="flex items-center justify-center w-full mt-2 z-0">
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
                                isStillHim={isStillHim}
                            />
                        </div>
                        <UserScoreDetail scores={data.scores} data={user} error={data.scoresError} />
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



/** 阻止 Action 触发 Loader */
export const shouldRevalidate: ShouldRevalidateFunction = ({ actionResult, defaultShouldRevalidate }) => {
    if (actionResult?.donotLoad) {
        return false;
    }
    return defaultShouldRevalidate;
};
