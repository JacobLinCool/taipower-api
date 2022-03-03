import { CACHE_INIT, CACHE_UPDATE } from "./kv_cache";
import router from "./router";

export default {
    async fetch(request: Request, environment: { CACHE: KVNamespace }): Promise<Response> {
        try {
            CACHE_INIT(environment.CACHE);
            return await router.handle(request);
        } catch (err) {
            console.error(err);
            return new Response((<Error>err).message, {
                status: 500,
                headers: { "Content-Type": "text/plain" },
            });
        }
    },
    async scheduled(
        controller: ScheduledController,
        environment: { CACHE: KVNamespace },
    ): Promise<void> {
        CACHE_INIT(environment.CACHE);

        let retry = 3;
        while (retry > 0) {
            try {
                return await CACHE_UPDATE();
            } catch (err) {
                console.error(err);
                if (--retry === 0) {
                    throw err;
                }
            }
        }
    },
};
