import { get_data, get_data_from_taipower_api, process_taipower_api_data } from "./api.js";

async function handle_cron(event) {
    const url = "https://taipower-api.jacob.workers.dev/";
    const request = new Request(url);

    const cache_key = new Request(url, request);
    const cache = caches.default;

    let response = await cache.match(cache_key);
    if (!response) {
        const processed_data = await get_data();

        response = new Response(JSON.stringify(processed_data, null, 4), {
            headers: {
                "Content-Type": "application/json",
                "Cross-Origin-Resource-Policy": "cross-origin",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
            },
        });
        response.headers.append("Cache-Control", "max-age=45, s-maxage=45");
        await cache.put(cache_key, response.clone());
    }
}

export { handle_cron };
