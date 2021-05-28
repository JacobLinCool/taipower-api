import { CACHE_UPDATE, CACHE_DATA } from "./kv_cache.js";

async function handle_websocket() {
    const ws_pair = new WebSocketPair();
    const [client, server] = Object.values(ws_pair);
    server.accept();

    server.addEventListener("message", async (event) => {
        server.send("!");
    });

    server.send(await CACHE_DATA());

    setInterval(async () => {
        server.send(await CACHE_DATA());
    }, 60 * 1000);

    return new Response(null, {
        status: 101,
        webSocket: client,
    });
}

export { handle_websocket };
