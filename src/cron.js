import { CACHE_UPDATE, CACHE_DATA } from "./kv_cache.js";

async function handle_cron(event) {
    await CACHE_UPDATE();
}

export { handle_cron };
