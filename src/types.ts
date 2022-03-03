export interface Result {
    resource_id: string;
}

export interface PlantRecord {
    curr_load: string;
    curr_util_rate: string;
    fore_maxi_sply_capacity: string;
    fore_peak_dema_load: string;
    fore_peak_resv_capacity: string;
    fore_peak_resv_rate: string;
    fore_peak_resv_indicator: string;
    fore_peak_hour_range: string;
    publish_time: string;
    yday_date: string;
    yday_maxi_sply_capacity: string;
    yday_peak_dema_load: string;
    yday_peak_resv_capacity: string;
    yday_peak_resv_rate: string;
    yday_peak_resv_indicator: string;
    real_hr_maxi_sply_capacity: string;
    real_hr_peak_time: string;
}

export interface Load {
    success: string;
    result: Result;
    records: PlantRecord[];
}

export interface Usage {
    "": string;
    aaData: [string, string, string, string, string, string, string][];
}

export interface Parsed {
    time: string;
    usage: {
        current: number;
        capacity: number;
        percentage: number;
    };
    statistics: Record<string, number>;
    plants: Record<string, unknown[]>;
}
