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
    const request = event.request;

    const upgrade_header = request.headers.get("Upgrade");
    if (upgrade_header && upgrade_header === "websocket") {
        return handle_websocket(request);
    } else {
        const url = new URL(request.url).origin + "/";
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
            response.headers.append("Cache-Control", "s-maxage=30");
            event.waitUntil(cache.put(cache_key, response.clone()));
        }
        return response;
    }
}
