import { CACHE_UPDATE, CACHE_DATA } from "./src/kv_cache.js";
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

    if (event.request.url.includes("/test")) {
        if (event.request.url.includes("cron")) {
            const result = await handle_cron(event);
            return new Response(JSON.stringify(result));
        }
    }

    const response = new Response(await CACHE_DATA(), {
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cross-Origin-Resource-Policy": "cross-origin",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Cache-Control": "max-age=60, s-maxage=60",
            "X-Location": event.request.cf.colo,
        },
    });
    return response;
}
