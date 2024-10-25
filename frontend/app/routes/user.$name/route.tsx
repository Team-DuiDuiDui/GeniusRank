import { type MetaFunction } from '@remix-run/cloudflare';
import { loader } from './loader';
import { isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react';
import UserBasic from '~/components/userinfo/basic';
import UserInfo from '~/components/userinfo/info';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title }, { name: 'description', content: data?.description }];
};

export { loader };

export default function Index() {
    const data = useLoaderData<typeof loader>();
    return (
        <>
            <div className="flex h-screen items-center justify-center w-full">
                <div className="flex flex-row items-center gap-16 w-full h-full justify-center">
                    <UserBasic>
                        <UserInfo data={data.userData} />
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
                    <div>没找到用户</div>
                </div>
            );
        else
            return (
                <div>
                    <h1>
                        {error.status} {error.statusText}
                    </h1>
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
