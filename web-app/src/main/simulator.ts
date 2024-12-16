import {
    ChargePoint,
    ChargePoints,
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
    roundTo,
    UniformChargePoints,
    Years
} from "./types";
import {pCarArrivalData, pCarDemandData} from "./data-parser";


const API_URL = "http://localhost:3001/api";

export interface ChargeEventCount {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
}

export interface SimulationResults {
    totalEnergySpent: Energy_KwH;
    theoreticalMaxPowerUsed: Power_Kw;
    actualMaxPowerUsed: Power_Kw;
    concurrency: number; // Should be a percentage
    eachChargePointContribution: Power_Kw[];
    chargeEventAverage: ChargeEventCount;
    powerHistoryMat: Power_Kw[][];
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

const getEventAverages = (
    eventHistory: number[],
    intervalsPerHour: number
): ChargeEventCount => {
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Non-leap year
    
    const intervalsPerDay = hoursInADay * intervalsPerHour;
    const intervalsPerMonth = daysInMonths.map(days => days * intervalsPerDay);
    const intervalsPerWeek = intervalsPerDay * 7;
    const intervalsPerYear = intervalsPerMonth.reduce((sum, int) => sum + int, 0);
    
    const calculateDailyAverage = () => {
        const numDays = Math.floor(eventHistory.length / intervalsPerDay);
        let totalEvents = 0;
        
        for (let day = 0; day < numDays; day++) {
            const start = day * intervalsPerDay;
            const end = start + intervalsPerDay;
            totalEvents += eventHistory.slice(start, end).reduce((sum, val) => sum + val, 0);
        }
        
        return roundTo(totalEvents / numDays, 1);
    };
    
    const calculateWeeklyAverage = () => {
        const numWeeks = Math.floor(eventHistory.length / intervalsPerWeek);
        let totalEvents = 0;
        
        for (let week = 0; week < numWeeks; week++) {
            const start = week * intervalsPerWeek;
            const end = start + intervalsPerWeek;
            totalEvents += eventHistory.slice(start, end).reduce((sum, val) => sum + val, 0);
        }
        
        return roundTo(totalEvents / numWeeks, 1);
    };
    
    
    const calculateMonthlyAverage = () => {
        let start = 0;
        const monthlyTotals = intervalsPerMonth.map(intervals => {
            const end = start + intervals;
            const total = eventHistory.slice(start, end).reduce((sum, val) => sum + val, 0);
            start = end;
            return total;
        });
        return roundTo(monthlyTotals.reduce((sum, val) => sum + val, 0) / monthlyTotals.length, 1);
    };
    
    const calculateYearlyAverage = () => {
        const numYears = Math.floor(eventHistory.length / intervalsPerYear);
        let totalEvents = 0;
        
        for (let year = 0; year < numYears; year++) {
            const start = year * intervalsPerYear;
            const end = start + intervalsPerYear;
            totalEvents += eventHistory.slice(start, end).reduce((sum, val) => sum + val, 0);
        }
        
        return roundTo(totalEvents / numYears, 1);
    };
    
    
    return {
        daily: calculateDailyAverage(),
        weekly: calculateWeeklyAverage(),
        monthly: calculateMonthlyAverage(),
        yearly: calculateYearlyAverage()
    };
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
    
    //Todo: This function is a mess, refactor it to make it more modular
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
        const chargePointSnapshot_Power = chargePoints.map(() => 0);
        const chargingEventsHistory = Array.from({length: totalIntervals}, () => 0);
        
        for (let interval = 0; interval < totalIntervals; interval++) {
            // Reset the charge points
            chargePoints.forEach((cp) => {
                cp.intervalsLeft = Math.max(0, cp.intervalsLeft - 1);
            });
            
            const intervalNumOfTheDay = interval % (
                hoursInADay * intervalsInHour
            );
            
            // Check if a car arrives
            for (let cpIdx = 0; cpIdx < chargePoints.length; cpIdx++) {
                const cp = chargePoints[cpIdx];
                
                // Note assuming there is no QUEUE.
                // If a car arrives and the charge point is busy, the car will leave. Humans!!
                if (cp.intervalsLeft === 0 &&
                    carArrivalPbData[intervalNumOfTheDay] >= Math.random()) {
                    
                    chargingEventsHistory[interval] += 1;
                    
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
                    chargePointSnapshot_Power[idx] += cp.power;
                    // Snapshot of power used by each charge point
                    totalPowerUsedInInterval += cp.power;
                }
            });
            powerHistory.push(totalPowerUsedInInterval);
        }
        
        const totalEnergySpent: Energy_KwH = powerHistory.reduce((acc, power) => acc + power, 0) / intervalsInHour;
        const actualMaxPowerUsed = Math.max(...powerHistory);
        const theoryMaxPower = chargePoints.reduce((acc, cp) => acc + cp.power, 0);
        const eventAverages = getEventAverages(chargingEventsHistory, intervalsInHour);
        
        const results: SimulationResults = {
            totalEnergySpent: roundTo(totalEnergySpent, 1),
            theoreticalMaxPowerUsed: theoryMaxPower,
            actualMaxPowerUsed: actualMaxPowerUsed,
            concurrency: roundTo(actualMaxPowerUsed / theoryMaxPower, 1),
            eachChargePointContribution: chargePointSnapshot_Power,
            chargeEventAverage: eventAverages,
            powerHistoryMat: getPowerHistoryByWeek(powerHistory, intervalsInHour),
        }
        
        this.onFinishedSimulation(results);
        this.sendResultsToBackend(inputId, results);
    }
}


function getPowerHistoryByWeek(powerHistory: Power_Kw[], intervalsInAnHour: number){
    // I want power history matrix
    // AKA: Daily data and split into Week
    // 1. Split the power history into days
    
    const intervalsInDay = intervalsInAnHour * hoursInADay;
    const resultsByDay = [];
    for (let day = 0; day < daysInAYear; day++) {
        const start = day * intervalsInDay;
        const end = start + intervalsInDay;
        const totalPowerUsedInDay = powerHistory.slice(start, end).reduce((acc, power) => acc + power, 0);
        resultsByDay.push(totalPowerUsedInDay);
    }
    
    const resultsByWeek: Power_Kw[][] = [];
    for (let week = 0; week < daysInAYear / 7; week++) {
        const start = week * 7;
        const end = start + 7;
        resultsByWeek.push(resultsByDay.slice(start, end));
    }

    return Array.from({length: 7}, (_, day) =>
        resultsByWeek.map(week => week[day])
    );
}

