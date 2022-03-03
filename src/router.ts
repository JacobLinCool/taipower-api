/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * @file router.ts
 * This file contains the route logic for the application.
 * The exported `router` will be used by the `fetch` function in `index.ts`.
 */

// #region Setup Router
import { Router } from "itty-router";
import { CACHE_UPDATE, CACHE_DATA } from "./kv_cache";
import { handle_websocket } from "./websocket";
import append from "./headers";
const router = Router<Request>();
// #endregion

router.get("/", async () => {
    console.time("Response Time");
    const data = await CACHE_DATA();
    console.timeEnd("Response Time");
    const headers = append(new Headers({ "Cache-Control": "public, max-age=300" }), "cors", "json");
    return new Response(JSON.stringify(data), { headers });
});

router.get("/ws", async (req: Request) => {
    const upgrade_header = req.headers.get("Upgrade");
    if (upgrade_header == "websocket") {
        return await handle_websocket();
    } else {
        return new Response("Upgrade Header Needed.", { status: 400 });
    }
});

router.get("/pull", async () => {
    let retry = 3;
    while (retry > 0) {
        try {
            await CACHE_UPDATE();
            retry = 0;
        } catch (err) {
            console.error(err);
            if (--retry === 0) {
                throw err;
            }
        }
    }
    return new Response("Done", { headers: append(new Headers(), "text") });
});

// #region Fallback
router.get("*", async () => {
    return Response.redirect("https://taipower.pages.dev/", 301);
});
// #endregion

export default router;
