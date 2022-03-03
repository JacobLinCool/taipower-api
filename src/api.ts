/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Load, Usage, Parsed } from "./types";
import { Fetch } from "./cache.js";

async function get_data_from_taipower_api(): Promise<{ usage_data: Load; plant_data: Usage }> {
    try {
        console.time("API Request");
        const api_requests = [
            Fetch(`https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/loadpara.json`).then(
                (raw) => raw.json(),
            ) as Promise<Load>,
            Fetch(`https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/genary.json`).then(
                (raw) => raw.json(),
            ) as Promise<Usage>,
        ] as const;
        const [usage_data, plant_data] = await Promise.all(api_requests);

        console.timeEnd("API Request");
        return { usage_data, plant_data };
    } catch (err) {
        console.error(err);
        throw new Error("API Request Error: " + err);
    }
}

function process_taipower_api_data({
    usage_data,
    plant_data,
}: {
    usage_data: Load;
    plant_data: Usage;
}): Parsed {
    const processed_data = {
        time: plant_data[""],
        usage: {
            current: parseFloat(usage_data.records[0].curr_load) * 10,
            capacity: parseFloat(usage_data.records[1].fore_maxi_sply_capacity) * 10,
            percentage: parseFloat(usage_data.records[0].curr_util_rate),
        },
        statistics: { total: 0 } as Record<string, number>,
        plants: {} as Record<string, unknown[]>,
    };

    // Parse Plant Data
    plant_data["aaData"].forEach((raw) => {
        if (raw[2].includes("小計")) return;
        const plant = {
            type: "",
            name: raw[2].replaceAll(/\(註\d{1,2}\)/g, "").replaceAll(/&amp;/g, "&"),
            max: parseFloat(raw[3]) || 0,
            now: parseFloat(raw[4]) || 0,
            percentage: Math.floor((parseFloat(raw[4]) / parseFloat(raw[3])) * 1000) / 10,
            description: raw[6].trim(),
        };

        try {
            plant.type = Array.from(raw[0].matchAll(/<b>([^]+?)<\/b>/g))[0][1];
        } catch (e) {
            console.error(e);
        }

        if (!processed_data.plants[plant.type]) processed_data.plants[plant.type] = [];
        if (!processed_data.statistics[plant.type]) processed_data.statistics[plant.type] = 0;

        processed_data.plants[plant.type].push(plant);
        processed_data.statistics[plant.type] += plant.now;
    });

    // Fix Float Problem
    for (const [k, v] of Object.entries(processed_data.statistics)) {
        processed_data.statistics[k] = Math.floor(v * 100) / 100;
    }

    processed_data.statistics.total =
        Math.floor(Object.values(processed_data.statistics).reduce((a, b) => a + b) * 100) / 100;

    return processed_data;
}

async function get_data(): Promise<Parsed> {
    const { usage_data, plant_data } = await get_data_from_taipower_api();
    const processed_data = process_taipower_api_data({ usage_data, plant_data });

    return processed_data;
}

export { get_data, get_data_from_taipower_api, process_taipower_api_data };
