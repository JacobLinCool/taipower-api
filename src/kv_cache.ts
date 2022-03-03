import type { Parsed } from "./types.js";
import { get_data } from "./api.js";

let CACHE: KVNamespace;
const key = "cache";
const expiration = 5 * 60;

export async function CACHE_UPDATE(): Promise<void> {
    const processed_data = await get_data();
    console.time("KV Cache Write");
    await CACHE.put(key, JSON.stringify(processed_data), { expirationTtl: expiration });
    console.timeEnd("KV Cache Write");
}

export async function CACHE_DATA(): Promise<Parsed> {
    console.time("KV Cache Read");
    const data = ((await CACHE.get(key, "json")) || (await get_data())) as Parsed;
    console.timeEnd("KV Cache Read");
    return data;
}

export function CACHE_INIT(kv: KVNamespace): void {
    CACHE = kv;
}
