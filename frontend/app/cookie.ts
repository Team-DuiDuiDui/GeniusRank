import { createCookie } from '@remix-run/cloudflare';
export const user = createCookie('user');
export const lng = createCookie('lng');
