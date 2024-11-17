import { createCookie } from '@remix-run/cloudflare';
export const user = createCookie('user');
export const prefs = createCookie('prefs');
export const lng = createCookie('lng');
