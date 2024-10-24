/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from '@remix-run/cloudflare';
import { RemixServer } from '@remix-run/react';
import { isbot } from 'isbot';
import { createInstance, i18n as i18next } from 'i18next';
import i18nServer from './modules/i18n.server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import * as i18n from './config/i18n';
import { renderToReadableStream } from 'react-dom/server';

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    // This is ignored so we can keep it in the template for visibility.  Feel
    // free to delete this parameter in your app if you're not using it!
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadContext: AppLoadContext
) {
    const instance = createInstance();
    const lng = await i18nServer.getLocale(request);
    const ns = i18nServer.getRouteNamespaces(remixContext);

    await instance.use(initReactI18next).init({ ...i18n, lng, ns });

    return isbot(request.headers.get('user-agent') || '')
        ? handleBotRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext, instance)
        : handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext, instance);
}

async function handleBotRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
    _loadContext: AppLoadContext,
    i18next: i18next
) {
    const body = await renderToReadableStream(
        <I18nextProvider i18n={i18next}>
            <RemixServer context={remixContext} url={request.url} />
        </I18nextProvider>,
        {
            signal: request.signal,
            onError(error: unknown) {
                // Log streaming rendering errors from inside the shell
                console.error(error);
                responseStatusCode = 500;
            },
        }
    );
    await body.allReady;
    responseHeaders.set('Content-Type', 'text/html');
    return new Response(body, {
        headers: responseHeaders,
        status: responseStatusCode,
    });
}

async function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  _loadContext: AppLoadContext,
  i18next: i18next
) {
      const body = await renderToReadableStream(
        <I18nextProvider i18n={i18next}>
            <RemixServer context={remixContext} url={request.url} />
        </I18nextProvider>,
        {
            signal: request.signal,
            onError(error: unknown) {
                // Log streaming rendering errors from inside the shell
                console.error(error);
                responseStatusCode = 500;
            },
        }
    );
    responseHeaders.set('Content-Type', 'text/html');
    return new Response(body, {
        headers: responseHeaders,
        status: responseStatusCode,
    });
}
