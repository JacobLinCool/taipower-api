import { get_data, get_data_from_taipower_api, process_taipower_api_data } from "./api.js";

async function handle_cron(event) {
    const url = "https://taipower-api.jacob.workers.dev/";
    const request = new Request(url);

    const cache_key = new Request(url, request);
    const cache = caches.default;

    const processed_data = await get_data();

    response = new Response(JSON.stringify(processed_data), {
        headers: {
            "Content-Type": "application/json",
            "Cross-Origin-Resource-Policy": "cross-origin",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Cache-Control": "max-age=60, s-maxage=60",
            "X-Direct": "false",
        },
    });
    await cache.put(cache_key, response.clone());
}

export { handle_cron };
