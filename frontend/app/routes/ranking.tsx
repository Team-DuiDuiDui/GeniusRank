import { json, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { createInstanceForBe } from '~/api/instance';
import { getRankings } from '~/utils/requests/ranking';
export async function loader({ request, context }: LoaderFunctionArgs) {
    const url = new URL(request.url);
    const nation = url.searchParams.get('nation');
    const type = url.searchParams.get('type');
    const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL);
    try {
        const res = await getRankings(beInstance, nation, type);
        return json(res.data, { status: 200 });
    } catch (e) {
        throw new Response(
            JSON.stringify({
                code: 'error',
                data: null,
                // message: e.message,
                success: false,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}
