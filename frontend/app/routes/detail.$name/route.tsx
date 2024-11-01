import { userDataSchema } from '~/utils/requests/ghGraphql/typings/schema';
import { loader } from './loader';
import { isRouteErrorResponse, useLoaderData, useRouteError } from '@remix-run/react';

// export const meta: MetaFunction<typeof loader> = ({ data }) => {
//     return [{ title: data?.title ?? 'Error | Genius Rank' }, { name: 'description', content: data?.description }];
// };

export { loader };

export default function User() {
    const data = useLoaderData<typeof loader>();
    try {
        const ndt = userDataSchema.parse(data.data);
        console.log(ndt);
    } catch (e) {
        console.log(e);
    }

    return (
        <>
            <div className="flex items-center justify-center w-full"></div>
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
