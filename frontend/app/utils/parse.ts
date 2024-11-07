export const parseStringToJSONfy = (str: string): string => {
    const [start, end] = [str.indexOf('{'), str.lastIndexOf('}')];
    return str.slice(start, end + 1);
}

export const parseStringToArrayLike = (str: string): string => {
    const [start, end] = [str.indexOf('['), str.lastIndexOf(']')];
    return str.slice(start, end + 1);
}

export const parseStringToCodeBlockLike = (str: string): string => {
    const [start, end] = [str.indexOf('```'), str.lastIndexOf('```')];
    return str.slice(start + 3, end).replaceAll('\n', '');
}