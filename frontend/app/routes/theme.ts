import { ActionFunctionArgs, redirect } from '@remix-run/cloudflare';
import { prefs } from '~/cookie';

export async function action({ request }: ActionFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const preferences = (await prefs.parse(cookieHeader)) || {};
    preferences.theme = preferences.theme === 'dark' ? 'light' : 'dark';
    return redirect(request.headers.get('referer') ?? '/', {
        headers: {
            'Set-Cookie': await prefs.serialize(preferences),
        },
    });
}
