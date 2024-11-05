import cloneDeep from 'lodash/cloneDeep';


const hexColors: string[] = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
    "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
    "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7"
]

/**
 * 判断参数变量是否是一个Promise对象
 * @param obj 变量本身
 * @returns 是否是Promise对象
 */
export const isPromise = (obj: unknown): obj is Promise<unknown> => {
    return !!obj && (typeof obj === 'object' || typeof obj === 'function') && 'then' in obj && typeof (obj as PromiseLike<unknown>).then === 'function';
}

/**
 * 实现防抖函数
 * @param func 需要防抖的函数
 * @returns 包装后的防抖函数
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: unknown[]) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

/**
 * **谨慎使用**：实现防抖函数
 * 深拷贝参数，增加性能开销
 * @param func 需要防抖的函数
 * @returns 包装后的防抖函数
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const throttleWithDeepClone = (func: Function, delay: number) => {
    let lastCall = 0;
    let timerId: NodeJS.Timeout | null = null;
    let lastArgs: unknown[] | null = null;

    return function (...args: unknown[]) {
        const now = new Date().getTime();

        // TODO: 参考一下性能开销，有没有必要用深拷贝
        // 深拷贝参数，防止参数被修改
        lastArgs = cloneDeep(args);

        if (now - lastCall < delay) {
            if (timerId) {
                clearTimeout(timerId);
            }

            timerId = setTimeout(() => {
                lastCall = new Date().getTime();
                func(...(lastArgs as unknown[]));
            }, delay - (now - lastCall));
        } else {
            lastCall = now;
            func(...args);
        }
    };
};

export const parseStringToJSONfy = (str: string): string => {
    const [start, end] = [str.indexOf('{'), str.lastIndexOf('}')];
    return str.slice(start, end + 1);
}

export const parseURLParamsToObject = (url: string): Record<string, string> => {
    const params = url.split('?')[1];
    if (!params) return {};
    return params.split('&').reduce((acc, cur) => {
        const [key, value] = cur.split('=');
        acc[key] = value;
        return acc;
    }, {} as Record<string, string>);
}

interface RGB {
    r: number
    g: number
    b: number
}

export const interpolateColors = (colors: RGB[], percentage: number): RGB => {
    const n = colors.length;
    const scaledPercentage = percentage * (n - 1);
    const index = Math.floor(scaledPercentage);
    const t = scaledPercentage - index;

    const color1 = colors[index];
    const color2 = colors[Math.min(index + 1, n - 1)];

    const r = Math.round(color1.r + (color2.r - color1.r) * t);
    const g = Math.round(color1.g + (color2.g - color1.g) * t);
    const b = Math.round(color1.b + (color2.b - color1.b) * t);

    return { r, g, b };
}

export const interpolateColorsOfScore = (score: number): RGB => {
    const colors = hexColors.map(hexToRgb)
    return interpolateColors(colors, score/100)
}

export const interpolateColorsOfIcon = (confidence: number): string => {
    const colors = ["#ef4444", "#222"].map(hexToRgb)
    return RGBToHex(interpolateColors(colors, confidence)) 
}

export const RGBToHex = ({r, g, b}: RGB): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export const hexToRgb = (hex: string): RGB => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return { r, g, b }
}

