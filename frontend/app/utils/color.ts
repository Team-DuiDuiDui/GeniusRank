

interface RGB {
    r: number
    g: number
    b: number
}

const scoreHexColors: string[] = [
    '#a855f7',
    '#8b5cf6',
    '#6366f1',
    '#3b82f6',
    '#0ea5e9',
    '#06b6d4',
    '#14b8a6',
    '#10b981',
    '#22c55e',
    '#84cc16',
    '#eab308',
    '#f59e0b',
    '#f97316',
    '#ef4444'
]

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
    const colors = scoreHexColors.map(hexToRgb)
    return interpolateColors(colors, score / 100)
}

export const interpolateColorsOfIcon = (confidence: number): string => {
    const colors = ["#ef4444", "#222"].map(hexToRgb)
    return RGBToHex(interpolateColors(colors, confidence))
}

export const RGBToHex = ({ r, g, b }: RGB): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export const hexToRgb = (hex: string): RGB => {
    const bigint = parseInt(hex.slice(1), 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return { r, g, b }
}

