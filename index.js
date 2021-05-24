import { get_data } from "./src/api.js";

addEventListener("fetch", (event) => {
    event.respondWith(handle_request(event.request));
});

async function handle_request(request) {
    if (request.url.includes("/ws")) {
        return handle_websocket(request);
    }

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

async function handle_websocket(request) {
    const upgrade_header = request.headers.get("Upgrade");
    if (!upgrade_header || upgrade_header !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const ws_pair = new WebSocketPair();
    const [client, server] = Object.values(ws_pair);
    server.accept();

    const check_data = {
        timestamp: new Date(),
        msg: "check",
    };

    server.addEventListener("open", async (event) => {
        console.log("Connection Opened.");
        let processed_data = await get_data();
        server.send(JSON.stringify(processed_data));

        setInterval(() => {
            server.send(JSON.stringify(check_data));
        }, 60 * 1000);

        setInterval(async () => {
            let new_data = await get_data();
            if (new_data.time !== processed_data.time) {
                processed_data = new_data;
                server.send(JSON.stringify(processed_data));
            }
        }, 5 * 60 * 1000);

        setInterval(() => {
            server.send(
                JSON.stringify({
                    timestamp: new Date(),
                    msg: "closed",
                })
            );
        }, 1.5 * 60 * 60 * 1000);
    });
    server.addEventListener("message", async (event) => {
        const data = event.data;
    });
    server.addEventListener("close", async (event) => {
        console.log("Connection Closed.");
    });
}
