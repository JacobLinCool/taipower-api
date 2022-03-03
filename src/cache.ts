export async function Fetch(url: string, options = {}): Promise<Response> {
    const request = new Request(url, options);

    const cache_key = new Request(url, request);
    const cache = caches.default;

    let response = await cache.match(cache_key);
    if (!response) {
        response = await fetch(request);
        response = new Response(response.body, response);
        response.headers.append("Cache-Control", "public, maxage=60");
        cache.put(cache_key, response.clone());
    }
    return response;
}
