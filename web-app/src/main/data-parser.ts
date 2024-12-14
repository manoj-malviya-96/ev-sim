import carArrivalData from '../data/car-arrival.json';
import carDemandData from '../data/car-demand.json';
import {
    Distance_km,
    DistanceAndProbability,
    Probability,
    HourlyTimeAndProbability
} from "./types";

type DistanceKmString = `${Distance_km}km`

interface DistanceStringAndProbability {
    [distanceString: DistanceKmString]: Probability
}

export const distanceStringToDistanceKm = (distanceString: DistanceKmString): Distance_km => {
    return parseFloat(distanceString.replace('km', ''));
}


function parseCarArrivalData(data: HourlyTimeAndProbability): HourlyTimeAndProbability {
    return data;
}

function parseCarDemandData(data: DistanceStringAndProbability): DistanceAndProbability {
    const rawData: DistanceStringAndProbability = data;
    const result: DistanceAndProbability = {};
    
    for (const [key, value] of Object.entries(rawData)) {
        // Convert string keys to numeric keys and map the values
        const distanceKm = distanceStringToDistanceKm(key as DistanceKmString);
        result[distanceKm] = value;
    }
    return result;
}

export const pCarArrivalData: HourlyTimeAndProbability = parseCarArrivalData(carArrivalData);
export const pCarDemandData: DistanceAndProbability = parseCarDemandData(carDemandData);

