

interface RGB {
    r: number
    g: number
    b: number
}

const scoreHexColors: string[] = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
    "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
    "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7"
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

