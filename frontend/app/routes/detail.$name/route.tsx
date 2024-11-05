import { loader } from './loader';
import { isRouteErrorResponse, useLoaderData, useNavigation, useRouteError } from '@remix-run/react';
import { MetaFunction } from '@remix-run/cloudflare';
import UserBasic from '~/components/userinfo/basic';
import UserInfoDetail from '~/components/userinfo/detail/info';
import UserIssuesDetail from '~/components/userinfo/detail/issues';
import UserPullRequestsDetail from '~/components/userinfo/detail/prs';
import UserReposContributeDetail from '~/components/userinfo/detail/reposContribute';
import UserReposDetail from '~/components/userinfo/detail/repos';
import { Loader, LoadingOverlay } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import UserNation from '~/components/userinfo/region';

import UserScoreDetail from '~/components/userinfo/detail/score';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};

export { loader };

export default function User() {
    const data = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const { t } = useTranslation();
    const { user } = data.data;
    console.log(data.nationData)
    return (
        <>
            <div className="flex items-center justify-center w-full">
                <div className="flex flex-row items-center gap-16 w-full h-full justify-center relative">
                    <LoadingOverlay
                        visible={navigation.state === 'loading'}
                        className="items-start"
                        zIndex={30}
                        overlayProps={{ radius: 'sm', blur: 2, center: false }}
                        loaderProps={{
                            children: (
                                <div className="flex flex-col justify-center items-center gap-4">
                                    <Loader variant="dots" />
                                    <p className="text-base text-gray-500">{t('user.loading')}</p>
                                </div>
                            ),
                        }}
                    />
                    <UserBasic>
                        <div className="flex gap-4 w-full max-h-25">
                            <UserInfoDetail data={user} />
                            <UserNation
                                nationISO={data.nationData.nationISO}
                                nationLocale={t(`country.${data.nationData.nationISO}`)}
                                message={`${data.nationData.message}\n${t('user.confidence')}: ${
                                    data.nationData.confidence
                                }`}
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
