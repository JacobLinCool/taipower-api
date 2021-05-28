import { get_data } from "./api.js";

const key = "cache";
const expiration = 5 * 60;

async function CACHE_UPDATE() {
    const processed_data = await get_data();
    return await CACHE.put(key, JSON.stringify(processed_data), { expirationTtl: expiration });
}

async function CACHE_DATA() {
    return (await CACHE.get(key)) || (await CACHE_FAILBACK());
}

async function CACHE_FAILBACK() {
    return await get_data();
}

export { CACHE_UPDATE, CACHE_DATA };
