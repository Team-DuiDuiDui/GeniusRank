import { LoaderFunction } from '@remix-run/cloudflare';
import { createInstanceForBe } from '~/api/instance';
import { getSvgCard } from '~/utils/getSvgCard';
import { getRankingsByUser } from '~/utils/requests/ranking';

export const loader: LoaderFunction = async ({ params, context }) => {
    const headers = new Headers();
    const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL);
    if (params.name === undefined)
        return new Response(
            JSON.stringify({
                code: 'error',
                data: null,
                message: 'name is undefined',
                success: false,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    try {
        const res = await getRankingsByUser(beInstance, params.name);
        const svgContent = getSvgCard(res.data.data, params.name);
        headers.append('Content-Type', 'image/svg+xml');
        return new Response(svgContent, {
            headers: headers,
            status: 200,
        });
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
};
