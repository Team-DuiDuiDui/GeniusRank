export const parseStringToJSONfy = (str: string): string => {
    const [start, end] = [str.indexOf('{'), str.lastIndexOf('}')];
    return str.slice(start, end + 1);
}