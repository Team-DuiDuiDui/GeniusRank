import { loader } from './loader';
import { isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react';
import { MetaFunction } from '@remix-run/cloudflare';
import UserBasic from '~/components/userinfo/basic';
import UserInfoDetail from '~/components/userinfo/detail/info';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
};

export { loader };

export default function User() {
    const data = useLoaderData<typeof loader>();
    const { user } = data.data;
    console.log(user);
    return (
        <>
            <div className="flex items-center justify-center w-full">
                <div className="flex flex-row items-center gap-16 w-full h-full justify-center relative">
                    <UserBasic>
                        <UserInfoDetail data={user}></UserInfoDetail>
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
