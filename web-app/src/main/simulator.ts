import {
    ChargePoint,
    ChargePoints,
    roundTo,
    daysInAYear,
    Distance_km,
    DistanceAndProbability,
    Energy_KwH,
    EnergyConsumptionRate_kWH_per_100km,
    HourlyTimeAndProbability,
    Hours,
    hoursInADay,
    Minutes,
    minutesInAnHour,
    Percentage,
    Power_Kw,
    Probability,
    UniformChargePoints,
    Years
} from "./types";
import {pCarArrivalData, pCarDemandData} from "./data-parser";


const API_URL = "http://localhost:3001/api";

export interface SimulationResults {
    totalEnergySpent: Energy_KwH;
    theoreticalMaxPowerUsed: Power_Kw;
    actualMaxPowerUsed: Power_Kw;
    concurrency: number; // Should be a percentage
    eachChargePointContribution: Percentage[];
}

export interface SimulationInput {
    uniform_NumChargePoints: number;
    uniform_ChargePointPower: Power_Kw;
    carPowerRating: EnergyConsumptionRate_kWH_per_100km;
    carArrivalProbabilityMultiplier: Percentage;
}

const createUniformChargePoints = (props: UniformChargePoints): ChargePoints => {
    return Array.from({length: props.numberOfChargePoints}, (index) => {
        return {
            power: props.power,
            intervalsLeft: 0,
        } as ChargePoint
    });
}

const constructChargePoints = (props: UniformChargePoints): ChargePoints => {
    if (!props) {
        throw new Error("Charge point properties not set");
    }
    return createUniformChargePoints(props);
}


const parseCarArrivalData = (
    data: HourlyTimeAndProbability,
    intervalsInHour: number,
    multiplier: number
): Probability[] => {
    const result: Probability[] = [];
    
    Object.entries(data).forEach(([_, probability]) => {
        // Assuming poisson distribution, we divide the probability by the number of intervals in an hour
        const p = (
            probability * multiplier
        ) / intervalsInHour;
        for (let i = 0; i < intervalsInHour; i++) {
            result.push(p);
        }
    });
    
    return result;
};


const getCumulativeForCarDemand = (carDemand: DistanceAndProbability): DistanceAndProbability => {
    const result: DistanceAndProbability = {};
    let cumulative = 0;
    for (const [distance, probability] of Object.entries(carDemand)) {
        cumulative += probability;
        result[parseFloat(distance)] = cumulative;
    }
    return result;
}



export class SimulationController {
    public chargePointsProps: UniformChargePoints;
    public carPowerRating: EnergyConsumptionRate_kWH_per_100km;
    public carArrivalProbabilityMultiplier: Percentage;
    private readonly interval_min: Minutes;
    private readonly yearsToSimulate: Years;
    private readonly rawCarArrivalData: HourlyTimeAndProbability;
    private readonly carDemandCmProbability: DistanceAndProbability = [];
    private readonly onFinishedSimulation: (results: SimulationResults) => void;
    private updateListeners: Set<() => void> = new Set();
    
    constructor(onFinishedSimulation: (results: SimulationResults) => void) {
        this.chargePointsProps = {
            numberOfChargePoints: 20,
            power: 11,
        };
        this.carPowerRating = 18.0;
        this.carArrivalProbabilityMultiplier = 100.0;
        this.rawCarArrivalData = pCarArrivalData;
        this.carDemandCmProbability = getCumulativeForCarDemand(pCarDemandData);
        this.interval_min = 15;
        this.yearsToSimulate = 1;
        this.onFinishedSimulation = onFinishedSimulation;
        this.updateListeners = new Set();
        
        this.updateFromLastInput();
    }
    
    public setChargePointsSimple(uniformChargePoints: UniformChargePoints) {
        this.chargePointsProps = uniformChargePoints;
    };
    
    public setChargePointsAdvance() {
    }; // TODO
    
    public addUpdateListener(listener: () => void) {
        this.updateListeners.add(listener);
    }
    
    public removeUpdateListener(listener: () => void) {
        this.updateListeners.delete(listener);
    }
    
    private notifyInputUpdate() {
        this.updateListeners.forEach((listener) => listener());
    }
    
    public updateFromLastInput() {
        this.getLastInput().then((lastInput) => {
            if (lastInput) {
                this.chargePointsProps = {
                    numberOfChargePoints: lastInput.uniform_NumChargePoints,
                    power: lastInput.uniform_ChargePointPower,
                };
                this.carPowerRating = lastInput.carPowerRating;
                this.carArrivalProbabilityMultiplier = lastInput.carArrivalProbabilityMultiplier;
                this.notifyInputUpdate();
            }
        });
    }
    
    private async sendInputsToBackend() {
        const inputId = crypto.randomUUID();
        const inputConfig = {
            inputId: inputId,
            uniform_NumChargePoints: this.chargePointsProps.numberOfChargePoints,
            uniform_ChargePointPower: this.chargePointsProps.power || 0,
            carPowerRating: this.carPowerRating,
            carArrivalProbabilityMultiplier: this.carArrivalProbabilityMultiplier,
        };
        
        try {
            const response = await fetch(`${API_URL}/inputs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputConfig),
            });
            
            if (!response.ok) {
                throw new Error(`Failed to send inputs: ${response.statusText}`);
            }
            await response.json();
            return inputId.toString();
        }
        catch (error) {
            console.error("Error sending inputs to backend:", error);
        }
    }
    
    private async getLastInput() {
        try {
            const response = await fetch(`${API_URL}/inputs`);
            if (!response.ok) {
                throw new Error(`Failed to get last input: ${response.statusText}`);
            }
            const inputs = await response.json();
            return inputs[inputs.length - 1];
        }
        catch (error) {
            console.error("Error getting last input from backend:", error);
        }
    }
    
    private getRandomCarDemand(): Distance_km {
        const random = Math.random();
        for (const [distance, probability] of Object.entries(this.carDemandCmProbability)) {
            if (random <= probability) {
                return parseFloat(distance) as Distance_km;
            }
        }
        return 0;
    }
    
    
    private resetChargePointsForEveryInterval(chargePoints: ChargePoints) {
        chargePoints.forEach((cp) => {
            cp.intervalsLeft = Math.max(0, cp.intervalsLeft - 1);
        });
    }
    
    private sendResultsToBackend(inputId: string, results: SimulationResults) {
        const resultsConfig = {
            inputId: inputId,
            ...results,
        };
        
        fetch(`${API_URL}/results`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(resultsConfig),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to send results: ${response.statusText}`);
                }
                console.log("Results saved to backend");
            })
            .catch((error) => {
                console.error("Error sending results to backend:", error);
            });
    }
    
    public async simulate() {
        
        const inputId = await this.sendInputsToBackend();
        if (!inputId) {
            console.error("Failed to send inputs to backend");
            return;
        }
        
        const intervalsInHour = minutesInAnHour / this.interval_min;
        const carArrivalPbData = parseCarArrivalData(this.rawCarArrivalData,
            intervalsInHour,
            this.carArrivalProbabilityMultiplier / 100);
        const totalIntervals = this.yearsToSimulate * daysInAYear * hoursInADay * intervalsInHour;
        const chargePoints = constructChargePoints(this.chargePointsProps);
        
        const powerHistory = [];
        const chargePointSnapshot_Energy = chargePoints.map(() => 0);
        
        for (let interval = 0; interval < totalIntervals; interval++) {
            // Reset the charge points
            this.resetChargePointsForEveryInterval(chargePoints);
            
            const intervalNumOfTheDay = interval % (
                hoursInADay * intervalsInHour
            );
            
            // Check if a car arrives
            for (let cpIdx = 0; cpIdx < chargePoints.length; cpIdx++) {
                const cp = chargePoints[cpIdx];
                
                if (cp.intervalsLeft === 0 &&
                    carArrivalPbData[intervalNumOfTheDay] >= Math.random()) {
                    
                    // Car arrives at the charge point
                    const distance: Distance_km = this.getRandomCarDemand();
                    const energyRequired: Energy_KwH = distance * this.carPowerRating / 100;
                    const timeToCharge: Hours = energyRequired / cp.power;
                    cp.intervalsLeft = timeToCharge * intervalsInHour;
                }
            }
            
            // Calculate the total power used in this interval
            let totalPowerUsedInInterval = 0;
            chargePoints.forEach((cp, idx) => {
                if (cp.intervalsLeft > 0) {
                    chargePointSnapshot_Energy[idx] += cp.power / intervalsInHour;
                    // Snapshot of power used by each charge point
                    totalPowerUsedInInterval += cp.power;
                }
            });
            powerHistory.push(totalPowerUsedInInterval);
        }
        
        
        const totalEnergySpent: Energy_KwH = powerHistory.reduce((acc, power) => acc + power, 0) / intervalsInHour;
        const actualMaxPowerUsed = Math.max(...powerHistory);
        const theoryMaxPower = chargePoints.reduce((acc, cp) => acc + cp.power, 0);
        const eachChargePointContribution = chargePointSnapshot_Energy.map((energy) => {
            return roundTo(100 * energy / totalEnergySpent, 2); // Percentage
        })
        
        
        const results: SimulationResults = {
            totalEnergySpent: roundTo(totalEnergySpent, 2),
            theoreticalMaxPowerUsed: theoryMaxPower,
            actualMaxPowerUsed: actualMaxPowerUsed,
            concurrency: roundTo(actualMaxPowerUsed / theoryMaxPower, 2),
            eachChargePointContribution: eachChargePointContribution
        }
        
        this.onFinishedSimulation(results);
        this.sendResultsToBackend(inputId, results);
    }
}


