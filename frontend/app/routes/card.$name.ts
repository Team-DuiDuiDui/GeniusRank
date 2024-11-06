import { LoaderFunction } from '@remix-run/cloudflare';
import { createInstanceForBe } from '~/api/backend/instance';
import { BackEndError } from '~/hooks/useAxiosInstanceForBe';
import i18nServer from '~/modules/i18n.server';
import { getSvgCard, getErrorSvgCard } from '~/utils/getSvgCard';
import handleErrorCode from '~/utils/handleErrorCode';
import { getRankingsByUser } from '~/api/backend/ranking';

export const loader: LoaderFunction = async ({ params, context, request }) => {
    const headers = new Headers();
    const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL);
    const t = await i18nServer.getFixedT(request);
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
        console.log(res);
        if (res.data.code !== '0') throw new BackEndError(res, handleErrorCode(res.data.code, t));
        const svgContent = getSvgCard(res.data.data, params.name);
        headers.append('Content-Type', 'image/svg+xml');
        return new Response(svgContent, {
            headers: headers,
            status: 200,
        });
    } catch (e) {
        if (e instanceof BackEndError) {
            headers.append('Content-Type', 'image/svg+xml');
            if (e.response.data.code === 'B0200') {
                const svgContent = getErrorSvgCard({
                    title: 'User not in database',
                    detail: 'Please search the user at least one time on geniusrank.heuluck.top',
                });
                return new Response(svgContent, {
                    headers: headers,
                    status: 200,
                });
            } else {
                const svgContent = getErrorSvgCard({
                    title: t('user.err.something_wrong'),
                    detail: e.error,
                });
                return new Response(svgContent, {
                    headers: headers,
                    status: 200,
                });
            }
        }
    }
};
