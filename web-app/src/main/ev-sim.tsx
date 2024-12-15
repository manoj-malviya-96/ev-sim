import {SimulationController, SimulationResults} from "./simulator";
import Controls from "./controls";
import Analysis from "./analysis";
import {useState} from "react";


const EVSim = () => {
    const [results, setResults] = useState<SimulationResults | null>(null);
    const controller = new SimulationController((results: SimulationResults) => {
        setResults(results);
    });
    
    return (
        <div className="w-screen h-screen flex flex-row p-8 gap-8"
             style={{
                 // backgroundImage: `url(${Background})`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
             }}
        >
            <Controls controller={controller}/>
            <Analysis results={results}/>
        </div>
    );
}

export default EVSim;