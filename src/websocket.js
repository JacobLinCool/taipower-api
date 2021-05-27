async function handle_websocket() {
    const ws_pair = new WebSocketPair();
    const [client, server] = Object.values(ws_pair);
    server.accept();

    server.addEventListener("message", async (event) => {
        server.send("!");
    });

    send_data(server);

    setInterval(send_data(server), 60 * 1000);

    return new Response(null, {
        status: 101,
        webSocket: client,
    });
}

async function send_data(server) {
    let data = await get_cached();
    server.send(data);
}

async function get_cached() {
    const url = "https://taipower-api.jacob.workers.dev/";
    const request = new Request(url);

    const cache_key = new Request(url, request);
    const cache = caches.default;

    const response = await cache.match(cache_key);

    return response.text();
}

export { handle_websocket };
