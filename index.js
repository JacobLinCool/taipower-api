import { get_data } from "./src/api.js";
import { handle_websocket } from "./src/websocket.js";

addEventListener("fetch", (event) => {
    event.respondWith(handle_request(event.request));
});

async function handle_request(request) {
    const upgrade_header = request.headers.get("Upgrade");
    if (upgrade_header && upgrade_header === "websocket") {
        return handle_websocket(request);
    } else {
        const processed_data = await get_data();

        return new Response(JSON.stringify(processed_data, null, 4), {
            headers: {
                "Content-Type": "application/json",
                "Cross-Origin-Resource-Policy": "cross-origin",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
            },
        });
    }
}
