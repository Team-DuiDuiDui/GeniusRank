import { json, LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import { user } from '~/user-cookie';

export async function loader({ request, context }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    if (!cookie.access_token) return redirect('/unauthorized');
    return json({});
}
