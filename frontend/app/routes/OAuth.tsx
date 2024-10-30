import { json, LoaderFunctionArgs, redirect } from '@remix-run/cloudflare';
import axios from 'axios';
import { z } from 'zod';
import { user } from '~/user-cookie';

export async function loader({ request, context }: LoaderFunctionArgs) {
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await user.parse(cookieHeader)) || {};
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
        try {
            const res = await axios.post(
                `https://github.com/login/oauth/access_token`,
                {
                    client_id: context.cloudflare.env.GITHUB_CLIENT_ID,
                    client_secret: context.cloudflare.env.GITHUB_CLIENT_SECRET,
                    code: code,
                },
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );
            const oauthSchema = z.object({
                access_token: z.string(),
                scope: z.literal('user:email,read:user').or(z.literal('read:user,user:email')),
                token_type: z.string(),
            });
            const data = oauthSchema.parse(res.data);
            const { access_token, token_type } = data;
            const userData = await axios.get(`https://api.github.com/user`, {
                headers: {
                    Authorization: `${token_type} ${access_token}`,
                },
            });
            cookie.userAvatar = userData.data.avatar_url;
            cookie.username = userData.data.name;
            cookie.userLogin = userData.data.login;
            cookie.userEmail = userData.data.email;
            cookie.access_token = access_token;
            return redirect('/', {
                headers: {
                    'Set-Cookie': await user.serialize(cookie, {
                        secure: true,
                        httpOnly: true,
                        maxAge: 60 * 60 * 24,
                        sameSite: 'lax',
                    }),
                },
            });
        } catch (e) {
            console.log(e);
            return json({ error: e }, { status: 500 });
        }
    }

    return json({ error: 'No query provided' });
}

export default function OAuth() {
    return <div>OAuth</div>;
}
