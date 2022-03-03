import { CACHE_DATA } from "./kv_cache.js";

export async function handle_websocket(): Promise<Response> {
    const ws_pair = new WebSocketPair();
    const [client, server] = Object.values(ws_pair);
    server.accept();

    server.addEventListener("message", () => {
        server.send("!");
    });

    server.send(JSON.stringify(await CACHE_DATA()));

    setInterval(async () => {
        server.send(JSON.stringify(await CACHE_DATA()));
    }, 60 * 1000);

    return new Response(null, { status: 101, webSocket: client });
}
