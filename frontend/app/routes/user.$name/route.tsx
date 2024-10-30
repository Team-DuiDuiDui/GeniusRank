import { type MetaFunction } from '@remix-run/cloudflare';
import { loader } from './loader';
import { isRouteErrorResponse, useLoaderData, useNavigation, useParams, useRouteError } from '@remix-run/react';
import UserBasic from '~/components/userinfo/basic';
import UserInfo from '~/components/userinfo/info';
import { githubUser } from '~/utils/requests/ghapis/user';
import { useCallback, useEffect, useRef, useState } from 'react';
import UserPRs from '~/components/userinfo/prs';
import UserIssues from '~/components/userinfo/issues';
import UserRepositories from '~/components/userinfo/repos';
import { guessRegion } from '~/utils/region/main';
import { LoadingOverlay } from '@mantine/core';
import UserCommits from '~/components/userinfo/commits';
import useAxiosInstanceForBe from '~/hooks/useAxiosInstanceForBe';
import { useLocale } from 'remix-i18next/react';
import useAxiosInstanceForGithub from '~/hooks/useAxiosInstanceForGithub';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};

export { loader };

export default function Index() {
    const data = useLoaderData<typeof loader>();
    const navigation = useNavigation();
    const params = useParams();
    const locale = useLocale();
    const beInstance = useAxiosInstanceForBe();
    const githubInstance = useAxiosInstanceForGithub();
    const user = useRef(new githubUser(params?.name ?? '', undefined, data.userData));
    const [userRegion, setUserRegion] = useState<null | { nation: string }>(null);

    const getAndSetUserRegion = useCallback(async () => {
        const nation = await guessRegion({
            locale,
            userData: data.userData,
            beInstance: beInstance!,
            githubInstance: githubInstance!,
        });
        setUserRegion({ nation });
        console.log(userRegion);
    }, [beInstance, data.userData, githubInstance, locale, userRegion]);

    useEffect(() => {
        user.current.setUserName(params?.name ?? '');
        user.current.setUserData(data.userData);
    }, [data.userData, params?.name]);

    useEffect(() => {
        if (beInstance && githubInstance) {
            getAndSetUserRegion();
        }
    }, [beInstance, githubInstance, getAndSetUserRegion]);

    return (
        <>
            <div className="flex items-center justify-center w-full">
                <div className="flex flex-row items-center gap-16 w-full h-full justify-center relative">
                    <LoadingOverlay
                        visible={navigation.state === 'loading'}
                        className="items-start"
                        zIndex={30}
                        overlayProps={{ radius: 'sm', blur: 2, center: false }}
                        loaderProps={{ type: 'dots' }}
                    />
                    <UserBasic>
                        <UserInfo data={data.userData} />
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
                <h1>Error</h1>
                <p>{error.message}</p>
                <p>The stack trace is:</p>
                <pre>{error.stack}</pre>
            </div>
        );
    } else {
        return <h1>Unknown Error</h1>;
    }
}
