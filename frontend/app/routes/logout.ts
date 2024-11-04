import { ActionFunctionArgs, json } from '@remix-run/cloudflare';
import { user } from '~/cookie';

export async function action({ request }: ActionFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    return json(
        {},
        {
            headers: {
                'Set-Cookie': await user.serialize(cookie, {
                    expires: new Date(),
                    httpOnly: true,
                    sameSite: 'lax',
                    secure: true,
                }),
            },
        }
    );
}
