export interface ChargePoint {
    power: Power_Kw;
    intervalsLeft: number;
}

export type ChargePoints = ChargePoint[];

// Charge points can be constructed via two methods:
// 1. Uniform number of charge points with uniform power
export interface UniformChargePoints {
    numberOfChargePoints: number;
    power: Power_Kw;
}


// Strong types power units - can be better to define interplay like conversion from energy to power
// but for now, this is good enough I think.
export type Energy_KwH = number;
export type Power_Kw = number;
export type EnergyConsumptionRate_kWH_per_km = number;
export type EnergyConsumptionRate_kWH_per_100km = number;
export type Probability = number;
export type Percentage = number;
export type Hours = number;
export type Minutes = number;
export type Years = number;
export type HourlyTimeString = `${number}${number}:${number}${number}`
export type Distance_km = number;


export interface HourlyTimeAndProbability {
    [time: HourlyTimeString]: Probability
}

export interface DistanceAndProbability {
    [distance: Distance_km]: Probability
}


export const hoursInADay = 24;
export const minutesInAnHour = 60;
export const daysInAYear = 365;