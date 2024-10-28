export const useIfPrecise = (): boolean => {
    return localStorage.GITHUB_ACCESS_TOKEN ? true : false;
}