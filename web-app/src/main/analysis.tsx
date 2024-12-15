import React, {useEffect} from "react";
import Stats from "../atoms/stats";
import './data-parser';
import {SimulationResults} from "./simulator";
import {Energy_KwH, Percentage, Power_Kw, roundTo} from "./types";
import PlotlyPlotter from "../atoms/plotly-plotter";


interface AnalysisProps {
    results: SimulationResults | null;
    className?: string;
}


const ChargePointContributionPlot = ({eachChargePoint}: { eachChargePoint: Percentage[] }) => {
    const dataTrace: Partial<Plotly.Data> = {
        x: eachChargePoint.map((_, index) => index + 1),
        y: eachChargePoint,
        type: 'bar',
        marker: {color: 'rgb(50, 50, 50)'}, // Can be extracted via tailwind.
    };
    return <PlotlyPlotter
        minimalView={true}
        className={'w-full h-fit'}
        dataTrace={[dataTrace]}
    />;
}


const Analysis: React.FC<AnalysisProps> = ({results, className}) => {
    
    const [totalEnergySpent, setTotalEnergySpent] = React.useState<Energy_KwH>(0);
    const [actualMaxPower, setActualMaxPower] = React.useState<Power_Kw>(0);
    const [concurrency, setConcurrency] = React.useState<number>(0);
    const [eachChargePoint, setEachChargePoint] = React.useState<Percentage[]>([]);
    
    useEffect(() => {
        if (results) {
            setTotalEnergySpent(results.totalEnergySpent);
            setActualMaxPower(results.actualMaxPowerUsed);
            setConcurrency(results.concurrency);
            setEachChargePoint(results.eachChargePointContribution);
        }
    }, [results]);
    
    const averageChargePointContribution =
        roundTo(eachChargePoint.reduce((acc, val) => acc + val, 0)
            / eachChargePoint.length, 2);
    
    
    return (
        <div className={`w-full h-full p-2
                        max-h-screen overflow-auto gap-4 flex flex-col
                        ${className}`}>
            <div className={'flex flex-row w-full h-fit gap-3 '}>
                <Stats label="Total Charge Expected (kwH)" value={totalEnergySpent}
                       icon='fas fa-bolt'/>
                <Stats label="Max Charge Expected (kwH)" value={actualMaxPower}/>
            </div>
            <Stats label="Concurrency" icon='fas fa-money-bills' value={concurrency}/>
            
            <Stats label="Average Charge Point % Contribution"
                   value={averageChargePointContribution ? averageChargePointContribution : 0}
                   icon='fas fa-gas-pump'>
                {eachChargePoint.length > 0 && (
                    <ChargePointContributionPlot eachChargePoint={eachChargePoint}/>
                )}
            </Stats>
        </div>
    );
}

export default Analysis;