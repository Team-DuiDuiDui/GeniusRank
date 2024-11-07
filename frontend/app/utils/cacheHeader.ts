export const cacheHeader = (clientSecs?: number, serverSecs?: number) => {
    return {
        headers: {
            'Cache-Control': `public, ${clientSecs ? `max-age=${clientSecs}` : ""}, ${serverSecs ? `s-maxage=${serverSecs}` : ""}, stale-while-revalidate=3600, stale-if-error=3600`,
        }
    }
}