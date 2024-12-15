import {
    ChargePoint, ChargePoints, DistanceAndProbability,
    Energy_KwH, EnergyConsumptionRate_kWH_per_100km,
    EnergyConsumptionRate_kWH_per_km,
    Minutes, Percentage,
    Power_Kw, Probability,
    HourlyTimeAndProbability,
    Years, Distance_km, Hours, hoursInADay, daysInAYear
} from "./types";
import {pCarArrivalData, pCarDemandData} from "./data-parser";


export interface SimulationResults {
    totalEnergySpent: Energy_KwH;
    theoreticalMaxPowerUsed: Power_Kw;
    actualMaxPowerUsed: Power_Kw;
    concurrency: number; // Should be a percentage
    powerHistory: Power_Kw[];
}

export const createUniformChargePoints = (numberOfChargePoints: number, power: Power_Kw): ChargePoints => {
    return Array.from({length: numberOfChargePoints}, (index) => {
        return {
            power: power,
            intervalsLeft: 0,
        } as ChargePoint
    });
}

function roundTo(numer: number, places: number) {
    const factor = Math.pow(10, places);
    return Math.round(numer * factor) / factor;
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
    private getChargePoints: () => ChargePoints;
    private carPowerRating: EnergyConsumptionRate_kWH_per_km;
    private carArrivalProbabilityMultiplier: number;
    private readonly interval_min: Minutes;
    private readonly yearsToSimulate: Years;
    private readonly rawCarArrivalData: HourlyTimeAndProbability;
    private readonly carDemandCmProbability: DistanceAndProbability = [];
    private readonly onFinishedSimulation: (results: SimulationResults) => void;
    
    constructor(onFinishedSimulation: (results: SimulationResults) => void) {
        this.getChargePoints = () => [];
        this.carPowerRating = 0.18;
        this.carArrivalProbabilityMultiplier = 1.0;
        this.rawCarArrivalData = pCarArrivalData;
        this.carDemandCmProbability = getCumulativeForCarDemand(pCarDemandData);
        this.interval_min = 15;
        this.yearsToSimulate = 1;
        this.onFinishedSimulation = onFinishedSimulation;
    }
    
    public setChargePointsSimple(numberOfChargePoints: number, power: Power_Kw) {
        this.getChargePoints = () => createUniformChargePoints(numberOfChargePoints, power);
    }
    
    public setChargePointsAdvance() {
    }; // TODO
    
    public setCarPowerRating(power: EnergyConsumptionRate_kWH_per_100km) {
        this.carPowerRating = power / 100;
    }
    
    public setCarArrivalProbabilityMultiplier(multiplier: Percentage) {
        this.carArrivalProbabilityMultiplier = multiplier / 100;
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
    
    public simulate() {
        const intervalsInHour = 60 / this.interval_min;
        const carArrivalPbData = parseCarArrivalData(this.rawCarArrivalData,
            intervalsInHour,
            this.carArrivalProbabilityMultiplier);
        const totalIntervals = this.yearsToSimulate * daysInAYear * hoursInADay * intervalsInHour;
        const chargePoints = this.getChargePoints();
        
        const powerHistory = [];
        
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
                    const energyRequired: Energy_KwH = distance * this.carPowerRating;
                    const timeToCharge: Hours = energyRequired / cp.power;
                    cp.intervalsLeft = timeToCharge * intervalsInHour;
                }
            }
            
            // Calculate the total power used in this interval
            let totalPowerUsedInInterval = 0;
            chargePoints.forEach((cp) => {
                if (cp.intervalsLeft > 0) {
                    totalPowerUsedInInterval += cp.power;
                }
            });
            powerHistory.push(totalPowerUsedInInterval);
        }
        
        const actualMaxPowerUsed = Math.max(...powerHistory);
        const theoryMaxPower = chargePoints.reduce((acc, cp) => acc + cp.power, 0);
        const results: SimulationResults = {
            totalEnergySpent: roundTo(
                powerHistory.reduce((acc, power) => acc + power, 0) / intervalsInHour, 2),
            theoreticalMaxPowerUsed: theoryMaxPower,
            actualMaxPowerUsed: actualMaxPowerUsed,
            concurrency: actualMaxPowerUsed / theoryMaxPower,
            powerHistory: powerHistory,
        }
        
        this.onFinishedSimulation(results);
        
    }
}
    















