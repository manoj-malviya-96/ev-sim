export interface ChargePoint {
    id: number;
    power: number;
    active: boolean;
}

// Strong types power units - can be better to define interplay like conversion from energy to power
// but for now, this is good enough I think.
export type Energy_KwH = number;
export type Power_Kw = number;
export type EnergyConsumptionRate_kWH_per_km = number;
export type Probability = number;
export type Minutes = number;
export type Years = number;
export type HourlyTimeString = `${number}${number}:${number}${number}`
export type Distance_km = number;


export interface TimeAndProbability {
    [time: HourlyTimeString]: Probability
}

type DistanceKmString = `${Distance_km}km`

export interface DistanceStringAndProbability {
    [distanceString: DistanceKmString]: Probability
}

export const distanceStringToDistanceKm = (distanceString: DistanceKmString): Distance_km => {
    return parseFloat(distanceString.replace('km', ''));
}


export const validateProbability = (probability: Probability): boolean => {
    return probability >= 0 && probability <= 1;
}