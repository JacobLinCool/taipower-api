addEventListener("fetch", (event) => {
    event.respondWith(handle_request(event.request));
});

async function handle_request(request) {
    let plants_raw_data = await fetch(`https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/genary.json`).then((r) => r.json());
    let usage_raw_data = await fetch(`https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/loadpara.json`).then((r) => r.json());
    let processed_data = {
        time: plants_raw_data[""],
        usage: {
            current: parseFloat(usage_raw_data.records[0].curr_load * 10),
            capacity: parseFloat(usage_raw_data.records[1].fore_maxi_sply_capacity * 10),
            percentage: parseFloat(usage_raw_data.records[0].curr_util_rate),
        },
        statistics: {
            total: 0,
        },
        plants: {},
    };

    plants_raw_data["aaData"].forEach((raw) => {
        if (raw[1] == "小計") return;
        let plant = {
            type: "",
            name: raw[1].replaceAll(/\(註\d{1,2}\)/g, "").replaceAll(/&amp;/g, "&"),
            max: parseFloat(raw[2]) || 0,
            now: parseFloat(raw[3]) || 0,
            percentage: parseInt((parseFloat(raw[3]) / parseFloat(raw[2])) * 1000) / 10,
            description: raw[5].trim(),
        };

        try {
            plant.type = Array.from(raw[0].matchAll(/<b>([^]+?)<\/b>/g))[0][1];
        } catch (e) {}

        if (!processed_data.plants[plant.type]) processed_data.plants[plant.type] = [];
        if (!processed_data.statistics[plant.type]) processed_data.statistics[plant.type] = 0;

        processed_data.plants[plant.type].push(plant);
        processed_data.statistics[plant.type] += plant.now;
    });

    for (let [k, v] of Object.entries(processed_data.statistics)) {
        processed_data.statistics[k] = parseInt(v * 100) / 100;
    }
    processed_data.statistics.total = parseInt(Object.values(processed_data.statistics).reduce((a, b) => a + b) * 100) / 100;

    return new Response(JSON.stringify(processed_data, null, 4), {
        headers: {
            "Content-Type": "application/json",
            "Cross-Origin-Resource-Policy": "cross-origin",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
        },
    });
}
