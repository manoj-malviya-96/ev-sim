import {SimulationController, SimulationResults} from "./simulator";
import Controls from "./controls";
import Analysis from "./analysis";
import {useState} from "react";


const EVSim = () => {
    const [results, setResults] = useState<SimulationResults | null>(null);
    const controller = new SimulationController((results: SimulationResults) => {
        setResults(results);
    });
    controller.updateFromLastInput();
    
    return (
        <div className="w-screen h-screen p-8">
            <h1 className="text-4xl font-bold text-center">EV Simulator</h1>
            <div className="flex flex-row p-8 gap-8">
                <Controls controller={controller}/>
                <Analysis results={results}/>
            </div>
        </div>
    );
}

export default EVSim;