import { type MetaFunction } from '@remix-run/cloudflare';
import { loader } from './loader';
import { useLoaderData } from '@remix-run/react';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title }, { name: 'description', content: data?.description }];
};

export { loader };

export default function Index() {
    const data = useLoaderData<typeof loader>();
    return (
        <>
            <div className="flex h-screen items-center justify-center w-full">
                <div className="flex flex-row items-center gap-16 w-full h-full justify-center"></div>
            </div>
        </>
    );
}
