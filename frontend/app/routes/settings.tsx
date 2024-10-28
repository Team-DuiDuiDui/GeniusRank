import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { Form } from '@remix-run/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18nServer from '~/modules/i18n.server';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title }];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    return json({ title: t('languages') });
}

export default function Index() {
    const { t } = useTranslation();
    const [token, setToken] = useState<string>('');

    const handleConfirmClick = () => {
        localStorage.setItem('GITHUB_ACCESS_TOKEN', token)
    }

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
            <h1>{t('languages')}</h1>

            <Form>
                <button type="submit" name="lng" value="zh-CN">
                    中文
                </button>
                <button type="submit" name="lng" value="en">
                    English
                </button>
            </Form>

            <div>
                <span>你的 GITHUB_ACCESS_TOKEN ：</span>
                <input type="text" name="token" onChange={e=>{setToken(e.target.value)}}/>
                <button onClick={handleConfirmClick}>确认</button>
            </div>
        </div>
    );
}
