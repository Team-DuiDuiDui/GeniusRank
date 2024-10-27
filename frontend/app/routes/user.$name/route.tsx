import { type MetaFunction } from '@remix-run/cloudflare';
import { loader } from './loader';
import { isRouteErrorResponse, useLoaderData, useNavigation, useParams, useRouteError } from '@remix-run/react';
import UserBasic from '~/components/userinfo/basic';
import UserInfo from '~/components/userinfo/info';
import { githubUser } from '~/utils/requests/ghapis/user';
import { useEffect, useRef, useState } from 'react';
import UserPRs from '~/components/userinfo/prs';
import { IssueSearchResult, UserRepos } from '~/utils/requests/ghapis/typings/user';
import UserIssues from '~/components/userinfo/issues';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ZodError } from 'zod';
import { useTranslation } from 'react-i18next';
import UserRepositories from '~/components/userinfo/repos';
import { GuessNationProps as GuessRegionProps, guessRegion } from '~/utils/region/main';
import { createInstanceForGithub } from '~/utils/requests/instance';
import { LoadingOverlay } from '@mantine/core';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};

export { loader };

export default function Index() {
    const data = useLoaderData<typeof loader>();
    const { t } = useTranslation();
    const navigation = useNavigation();
    const params = useParams();
    /** 很抽象，但是是为了 useEffect 最佳实践
     * Cache 用于减少请求次数
     */
    const effectCache = useRef<boolean>(false),
        /** Flag 在清除机制中改变 */
        effectFlag = useRef<boolean>(false);
    const [userPRs, setUserPRs] = useState<null | IssueSearchResult>(null);
    const [userIssues, setUserIssues] = useState<null | IssueSearchResult>(null);
    const [userRegion, setUserRegion] = useState<null | unknown>(null);
    const [userRepositories, setUserRepositories] = useState<null | UserRepos>(null);
    // const axiosInstance = axios.create({
    //     baseURL: 'https://api.github.com',
    //     headers: localStorage.GITHUB_ACCESS_TOKEN ? {
    //         Authorization: `token ${localStorage.GITHUB_ACCESS_TOKEN}`,
    //     }: {},
    // });
    const getAndSetUserRegion = async () => {
        const axiosInstance = createInstanceForGithub(localStorage.GITHUB_ACCESS_TOKEN);
        setUserRegion(await guessRegion({ userData: data.userData, axiosInstance }));
        console.log(userRegion);
    };
    useEffect(() => {
        const user = new githubUser(params?.name ?? '');
        const getAndSetUserInfos = async () => {
            try {
                setUserPRs(await user.getUserPrs());
                setUserIssues(await user.getUserIssues());
                setUserRepositories(await user.getUserRepos());
            } catch (e) {
                console.error(e);
                // eslint-disable-next-line import/no-named-as-default-member
                if (axios.isAxiosError(e)) {
                    console.log(e);
                    if (e.status === 404) toast.error(t('user.err.not_found'));
                    if (e.status === 403) {
                        throw toast.error(t('user.err.rate_limit'));
                    } else toast.error(t('user.err.something_wrong'));
                } else if (e instanceof ZodError) toast.error(t('user.err.parse_error'));
                else toast.error(t('user.err.something_wrong'));
            }
        };
        setUserPRs(null);
        setUserIssues(null);
        setUserRepositories(null);
        if (!effectCache.current) {
            effectCache.current = true;
            getAndSetUserInfos();
        }
        if (effectFlag.current) {
            // 重新请求前重置
            effectCache.current = false;
            effectFlag.current = false;
        }
        return () => {
            effectFlag.current = true;
        };
        // getAndSetUserRegion();
    }, [data, params?.name, t]);
    return (
        <>
            <div className="flex  items-center justify-center w-full">
                <div className="flex flex-row items-center gap-16 w-full h-full justify-center relative">
                    <LoadingOverlay
                        visible={navigation.state === 'loading'}
                        className="items-start"
                        zIndex={1000}
                        overlayProps={{ radius: 'sm', blur: 2, center: false }}
                        loaderProps={{ type: 'dots' }}
                    />
                    <UserBasic>
                        <UserInfo data={data.userData} />
                        <UserPRs data={userPRs} />
                        <UserIssues data={userIssues} />
                        <UserRepositories data={userRepositories} userData={data.userData} />
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
