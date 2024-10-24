import { serverOnly$ } from 'vite-env-only/macros';
import enTranslation from '~/locales/en.json';
import zhTranslation from '~/locales/zh.json';

export const supportedLngs = ['zh', 'en'];
export const fallbackLng = 'zh';
export const defaultNS = 'translation';

export const resources = serverOnly$({
    en: { translation: enTranslation.common },
    zh: { translation: zhTranslation.common },
});
