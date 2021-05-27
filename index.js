import { get_data } from "./src/api.js";
import { handle_cron } from "./src/cron.js";
import { handle_websocket } from "./src/websocket.js";

addEventListener("fetch", (event) => {
    event.respondWith(handle_request(event));
});

addEventListener("scheduled", (event) => {
    event.waitUntil(handle_cron(event));
});

async function handle_request(event) {
    const upgrade_header = event.request.headers.get("Upgrade");
    if (upgrade_header == "websocket") {
        return await handle_websocket();
    }

    const url = "https://taipower-api.jacob.workers.dev/";
    const request = new Request(url);

    const cache_key = new Request(url, request);
    const cache = caches.default;

    let response = await cache.match(cache_key);
    if (!response) {
        const processed_data = await get_data();

        response = new Response(JSON.stringify(processed_data), {
            headers: {
                "Content-Type": "application/json",
                "Cross-Origin-Resource-Policy": "cross-origin",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
                "Cache-Control": "max-age=60, s-maxage=60",
                "X-Direct": "true",
            },
        });
        event.waitUntil(cache.put(cache_key, response.clone()));
    }
    return response;
}
