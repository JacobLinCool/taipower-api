import { get_data } from "./api.js";

async function handle_websocket(request) {
    const ws_pair = new WebSocketPair();
    const [client, server] = Object.values(ws_pair);
    server.accept();

    const check_data = {
        timestamp: new Date(),
        msg: "check",
    };

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

    server.addEventListener("message", async (event) => {
        const data = event.data;
    });
    server.addEventListener("close", async (event) => {
        console.log("Connection Closed.");
    });

    return new Response(null, {
        status: 101,
        webSocket: client,
    });
}

export { handle_websocket };