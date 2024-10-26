import { type MetaFunction } from '@remix-run/cloudflare';
import { loader } from './loader';
import { isRouteErrorResponse, useLoaderData, useParams, useRouteError } from '@remix-run/react';
import UserBasic from '~/components/userinfo/basic';
import UserInfo from '~/components/userinfo/info';
import { githubUser } from '~/utils/requests/ghapis/user';
import { useEffect, useState } from 'react';
import UserPRs from '~/components/userinfo/prs';
import { IssueSearchResult } from '~/utils/requests/ghapis/typings/user';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title }, { name: 'description', content: data?.description }];
};

export { loader };

export default function Index() {
    const data = useLoaderData<typeof loader>();
    const params = useParams();
    const user = new githubUser(params?.name ?? '');
    const [userPRs, setUserPRs] = useState<null | IssueSearchResult>(null);
    const getAndSetUserPRs = async () => {
        const prs = await user.getUserPrs();
        setUserPRs(prs);
    };
    useEffect(() => {
        setUserPRs(null);
        getAndSetUserPRs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);
    return (
        <>
            <div className="flex h-screen items-center justify-center w-full">
                <div className="flex flex-row items-center gap-16 w-full h-full justify-center">
                    <UserBasic>
                        <UserInfo data={data.userData} />
                        <UserPRs data={userPRs} />
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
                    <div>未找到用户</div>
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
