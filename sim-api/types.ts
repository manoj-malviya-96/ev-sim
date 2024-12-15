export interface SimulationInput {
    id: number;
    uniform_NumChargePoints: number;
    uniform_ChargePointPower: number;
    carPowerRating: number;
    carArrivalProbabilityMultiplier: number;
}

export interface SimulationResult {
    id: number;
    inputId: number;
    totalEnergySpent: number;
    theoreticalMaxPowerUsed: number;
    actualMaxPowerUsed: number;
    concurrency: number;
    powerHistory: number[];
}

export interface SimulationData {
    inputs: SimulationInput[];
    results: SimulationResult[];
}
