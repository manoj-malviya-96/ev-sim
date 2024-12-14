import React, {useEffect} from "react";
import Stats from "../atoms/stats";
import './data-parser';
import {SimulationResults} from "./simulator";
import {Energy_KwH, Power_Kw} from "./types";


interface AnalysisProps {
    results: SimulationResults | null;
    className?: string;
}


const Analysis: React.FC<AnalysisProps> = ({results, className}) => {
    
    const [totalEnergySpent, setTotalEnergySpent] = React.useState<Energy_KwH>(0);
    const [actualMaxPower, setActualMaxPower] = React.useState<Power_Kw>(0);
    const [concurrency, setConcurrency] = React.useState<number>(0);
    
    
    useEffect(() => {
        if (results) {
            setTotalEnergySpent(results.totalEnergySpent);
            setActualMaxPower(results.actualMaxPowerUsed);
            setConcurrency(results.concurrency);
        }
    }, [results]);
    
    
    return (
        <div className={`w-full h-full p-8 justify-center items-center ${className}`}>
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                <Stats label="Total Charge Expected (kwH)" value={totalEnergySpent}
                       icon='fas fa-bolt'/>
                <Stats label="Max Charge Expected (kwH)" value={actualMaxPower}
                       icon='fas fa-bolt'/>
                <Stats label="Concurrency" value={concurrency}
                       icon='fas fa-bolt'/>
            </div>
        </div>
    );
}

export default Analysis;