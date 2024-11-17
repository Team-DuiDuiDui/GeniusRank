import { ActionFunctionArgs, json, redirect } from '@remix-run/cloudflare';
import { ShouldRevalidateFunction } from '@remix-run/react';
import { prefs } from '~/cookie';

export async function action({ request }: ActionFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const preferences = (await prefs.parse(cookieHeader)) || {};
    preferences.theme = preferences.theme === 'dark' ? 'light' : 'dark';
    const body = await request.formData();
    if (body.get('doNotRedirect'))
        return json(
            { donotLoad: true },
            {
                headers: {
                    'Set-Cookie': await prefs.serialize(preferences),
                },
            }
        );
    return redirect(request.headers.get('referer') ?? '/', {
        headers: {
            'Set-Cookie': await prefs.serialize(preferences),
        },
    });
}

/** 阻止 Action 触发 Loader */
export const shouldRevalidate: ShouldRevalidateFunction = ({ actionResult, defaultShouldRevalidate }) => {
    if (actionResult?.donotLoad) {
        return false;
    }
    return defaultShouldRevalidate;
};
