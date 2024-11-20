import { type MetaFunction } from '@remix-run/cloudflare';
import { ShouldRevalidateFunction, useLoaderData, useNavigation, useParams, useRouteError } from '@remix-run/react';
import UserBasic from '~/components/userinfo/basic';
import UserInfo from '~/components/userinfo/info';
import { githubUser } from '~/api/github/rest/user';
import { useEffect, useRef } from 'react';
import UserPRs from '~/components/userinfo/prs';
import UserIssues from '~/components/userinfo/issues';
import UserRepositories from '~/components/userinfo/repos';
import { LoadingOverlay } from '@mantine/core';
import UserCommits from '~/components/userinfo/commits';
import useAxiosInstanceForBe from '~/hooks/useAxiosInstanceForBe';
import { useLocale } from 'remix-i18next/react';
import useAxiosInstanceForGithub from '~/hooks/useAxiosInstanceForGithub';
import UserNation from '~/components/userinfo/region';
import UserScore from '~/components/userinfo/score';
import { t } from 'i18next';
import loader from './loader';
import ErrorHandle from '~/components/errorHandle';

export { loader };

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};

export default function User() {
    const data = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const params = useParams();
    const locale = useLocale();
    const beInstance = useAxiosInstanceForBe(data.baseUrl)();
    const githubInstance = useAxiosInstanceForGithub()();
    const user = useRef(new githubUser(params?.name ?? '', undefined, data.userData, githubInstance, beInstance));
    useEffect(() => {
        user.current.setUserName(params?.name ?? '');
        user.current.setUserData(data.userData);
    }, [data.userData, params?.name]);

    return (
        <>
            <div className="flex items-center justify-center w-full mt-5 z-0">
                <div className="flex flex-row items-center gap-16 w-full h-full justify-center relative">
                    <LoadingOverlay
                        visible={navigation.state === 'loading'}
                        className="items-start"
                        zIndex={30}
                        overlayProps={{ radius: 'sm', blur: 2, center: false }}
                        loaderProps={{ type: 'dots' }}
                    />
                    <UserBasic>
                        <div className="md:flex md:gap-4 md:h-80 w-full h-auto items-start flex-col gap-3">
                            <UserInfo data={data.userData} />
                            <div className="hidden sm:block">
                                <UserNation
                                    data={null}
                                    nationISO="US"
                                    nationLocale={t(`country.US.${locale}`)}
                                    disable={true}
                                    confidence={0}
                                    message=""
                                />
                            </div>
                        </div>
                        <UserScore data={data.userData} user={user} />
                        <UserRepositories data={data.userData} user={user} />
                        <UserPRs user={user} data={data.userData} />
                        <UserIssues user={user} data={data.userData} />
                        <UserCommits user={user} data={data.userData} />
                    </UserBasic>
                </div>
            </div>
        </>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    return <ErrorHandle error={error} isUser />;
}

export const shouldRevalidate: ShouldRevalidateFunction = ({ actionResult, defaultShouldRevalidate }) => {
    if (actionResult?.donotLoad) {
        return false;
    }
    return defaultShouldRevalidate;
};
