async function get_data_from_taipower_api() {
    let api_requests = [
        fetch(`https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/loadpara.json`).then((raw) => raw.json()),
        fetch(`https://www.taipower.com.tw/d006/loadGraph/loadGraph/data/genary.json`).then((raw) => raw.json()),
    ];
    let [usage_data, plant_data] = await Promise.all(api_requests);

    return {
        usage_data,
        plant_data,
    };
}

function process_taipower_api_data({ usage_data, plant_data }) {
    // Declare Variable
    let processed_data = {
        time: plant_data[""],
        usage: {
            current: parseFloat(usage_data.records[0].curr_load * 10),
            capacity: parseFloat(usage_data.records[1].fore_maxi_sply_capacity * 10),
            percentage: parseFloat(usage_data.records[0].curr_util_rate),
        },
        statistics: {
            total: 0,
        },
        plants: {},
    };

    // Parse Plant Data
    plant_data["aaData"].forEach((raw) => {
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

    // Fix Float Problem
    for (let [k, v] of Object.entries(processed_data.statistics)) {
        processed_data.statistics[k] = parseInt(v * 100) / 100;
    }

    // Calculate Total
    processed_data.statistics.total = parseInt(Object.values(processed_data.statistics).reduce((a, b) => a + b) * 100) / 100;

    return processed_data;
}

async function get_data() {
    const { usage_data, plant_data } = await get_data_from_taipower_api();

    const processed_data = process_taipower_api_data({ usage_data, plant_data });

    return processed_data;
}

export { get_data };
