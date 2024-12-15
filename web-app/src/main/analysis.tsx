import React, {useEffect} from "react";
import Stats from "../atoms/stats";
import './data-parser';
import {ChargeEventCount, SimulationResults} from "./simulator";
import {Energy_KwH, Percentage, Power_Kw, roundTo} from "./types";
import PlotlyPlotter from "../atoms/plotly-plotter";


interface AnalysisProps {
    results: SimulationResults | null;
    className?: string;
}


const ChargePointContributionPlot = ({eachChargePoint}: { eachChargePoint: Percentage[] }) => {
    //Todo in log scale to show the difference.
    const dataTrace: Partial<Plotly.Data> = {
        x: eachChargePoint.map((_, index) => index + 1),
        y: eachChargePoint,
        type: 'bar',
        hovertemplate: '%{x} | Power : %{y} <extra></extra>',
        marker: {color: 'rgb(50, 50, 50)'}, // Can be extracted via tailwind.
    };
    return <PlotlyPlotter
        className={'w-56 h-32'}
        dataTrace={[dataTrace]}
    />;
}


const Analysis: React.FC<AnalysisProps> = ({results, className}) => {
    
    const [totalEnergySpent, setTotalEnergySpent] = React.useState<Energy_KwH>(0);
    const [actualMaxPower, setActualMaxPower] = React.useState<Power_Kw>(0);
    const [concurrency, setConcurrency] = React.useState<number>(0);
    const [eachChargePoint, setEachChargePoint] = React.useState<Percentage[]>([]);
    
    const [eventCount, setEventCount] = React.useState<ChargeEventCount>({
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0,
    });
    
    useEffect(() => {
        if (results) {
            setTotalEnergySpent(results.totalEnergySpent);
            setActualMaxPower(results.actualMaxPowerUsed);
            setConcurrency(results.concurrency);
            setEachChargePoint(results.eachChargePointContribution);
            setEventCount(results.chargeEventAverage);
        }
    }, [results]);
    
    const averageChargePointContribution =
        roundTo(eachChargePoint.reduce((acc, val) => acc + val, 0)
            / eachChargePoint.length, 2);
    
    return ( results &&
        <div className={`w-full h-full p-8 bg-white bg-opacity-20 border rounded-lg
                        max-h-screen overflow-auto flex flex-col gap-4
                        ${className}`}>
            <div className={'grid grid-cols-2 gap-0 '}>
                <Stats label="Total Charge Expected (KwH)" value={totalEnergySpent}
                       icon='fas fa-bolt'/>
                <Stats label="Max Charge Expected (KwH)" value={actualMaxPower}>
                    <span className="text-sm text-gray-600 text-left w-full">
                        Concurrency (Max/Theoretical power) for this setup is {concurrency}</span>
                </Stats>
                <Stats label="Mean Power by Each Charge Point"
                       value={averageChargePointContribution ? averageChargePointContribution : 0}
                       icon='fas fa-gas-pump'
                       className={'w-full h-fit'}
                >
                    {eachChargePoint.length > 0 && (
                        <ChargePointContributionPlot eachChargePoint={eachChargePoint}/>
                    )}
                </Stats>
            </div>
            <div className={'flex flex-row h-fit items-center w-full'}>
                <span className="text-md font-bold text-gray-500 mr-4"> Average Charging Events </span>
                <Stats label="Daily Average"
                       value={eventCount.daily}/>
                <Stats label="Weekly Average"
                       value={eventCount.weekly}/>
                <Stats label="Monthly Average"
                       value={eventCount.monthly}/>
                <Stats label="Yearly Average"
                       value={eventCount.yearly}/>
            </div>
        </div>
    );
}

export default Analysis;