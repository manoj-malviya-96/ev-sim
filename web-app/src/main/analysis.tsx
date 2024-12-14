import React from "react";
import Stats from "../atoms/stats";


interface AnalysisProps {
    className?: string;
}


const Analysis: React.FC<AnalysisProps> = ({className}) => {
    // const chargingValues = [10, 15, 20, 18, 22, 25, 28];
    // const labels = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00"];
    
    return (
        <div className={`w-full h-full p-8 justify-center items-center ${className}`}>
            <h1>Analysis</h1>
            <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                <Stats label="Total Charge Expected (kwH)" value={10} icon='fas fa-bolt'/>
                <Stats label="MAX Energy Spent (kwH)" value={30}/>
            </div>
        </div>
    );
}

export default Analysis;