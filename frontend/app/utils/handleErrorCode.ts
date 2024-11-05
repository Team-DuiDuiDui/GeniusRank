import { codeA, codeB, codeC } from '~/config/codes';
import { TFunction } from 'i18next';

/**
 *
 * @param code 传入的错误码
 * @param t i18next的t函数（useTranslation Hook）
 * @returns 错误信息（本地化）
 */
const handleErrorCode = (code: string, t: TFunction<'translation', undefined>): string => {
    code = code.toUpperCase();
    if (code === '0') return t('errorCode.0');
    else if (code.startsWith('A')) {
        return codeA.indexOf(code) > -1 ? t(`errorCode.${code}`) : t('errorCode.A0001');
    } else if (code.startsWith('B')) {
        return codeB.indexOf(code) > -1 ? t(`errorCode.${code}`) : t('errorCode.B0001');
    } else if (code.startsWith('C')) {
        return codeC.indexOf(code) > -1 ? t(`errorCode.${code}`) : t('errorCode.C0001');
    } else {
        return t('errorCode.unknown');
    }
};

export default handleErrorCode;
