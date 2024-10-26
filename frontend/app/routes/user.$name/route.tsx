import { type MetaFunction } from '@remix-run/cloudflare';
import { loader } from './loader';
import { isRouteErrorResponse, useLoaderData, useParams, useRouteError } from '@remix-run/react';
import UserBasic from '~/components/userinfo/basic';
import UserInfo from '~/components/userinfo/info';
import { githubUser } from '~/utils/requests/ghapis/user';
import { useEffect, useState } from 'react';
import UserPRs from '~/components/userinfo/prs';
import { IssueSearchResult, UserRepos } from '~/utils/requests/ghapis/typings/user';
import UserIssues from '~/components/userinfo/issues';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ZodError } from 'zod';
import { useTranslation } from 'react-i18next';
import UserRepositories from '~/components/userinfo/repos';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};

export { loader };

export default function Index() {
    const data = useLoaderData<typeof loader>();
    const { t } = useTranslation();
    const params = useParams();
    const user = new githubUser(params?.name ?? '');
    const [userPRs, setUserPRs] = useState<null | IssueSearchResult>(null);
    const [userIssues, setUserIssues] = useState<null | IssueSearchResult>(null);
    const [userRepositories, setUserRepositories] = useState<null | UserRepos>(null);
    const getAndSetUserInfos = async () => {
        try {
            const prs = await user.getUserPrs();
            setUserPRs(prs);
            const issues = await user.getUserIssues();
            setUserIssues(issues);
            setUserRepositories(await user.getUserRepos());
        } catch (e) {
            // eslint-disable-next-line import/no-named-as-default-member
            console.error(e);
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
    useEffect(() => {
        setUserPRs(null);
        getAndSetUserInfos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
    return (
        <>
            <div className="flex  items-center justify-center w-full">
                <div className="flex flex-row items-center gap-16 w-full h-full justify-center">
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
