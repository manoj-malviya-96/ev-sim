import {
    ChargePoint,
    DistanceStringAndProbability,
    Energy_KwH,
    EnergyConsumptionRate_kWH_per_km,
    Minutes,
    Power_Kw,
    TimeAndProbability,
    Years
} from "./types";

export interface SimulationResults {
    totalEnergySpent: Energy_KwH;
    theoreticalMaxPowerUsed: Power_Kw;
    actualMaxPowerUsed: Power_Kw;
    concurrency: number; // Should be a percentage
}


export interface SimulationInputs {
    chargePoints: ChargePoint[];
    timeInterval: Minutes;
    timeToSimulate: Years;
    carArrivalProbabilityMultiplier: number;
    carPowerRating: EnergyConsumptionRate_kWH_per_km;
}

export interface SimulationProbabilities {
    carArrivalProbabilities: TimeAndProbability;
    carDemandProbability: DistanceStringAndProbability;
}













