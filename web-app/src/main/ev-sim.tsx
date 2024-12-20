import {SimulationController, SimulationResults} from "./simulator";
import Controls from "./controls";
import Analysis from "./analysis";
import {useState} from "react";
import Logo from "../data/logo.svg";


const EVSim = () => {
    const [results, setResults] = useState<SimulationResults | null>(null);
    const controller = new SimulationController((results: SimulationResults) => {
        setResults(results);
    });
    controller.updateFromLastInput();
    
    return (
        <div className="w-screen h-screen p-8">
            <div className="flex flex-row w-full justify-center items-center">
                <img src={Logo} alt="logo" className="w-16 h-16"/>
                <h1 className="text-4xl font-bold text-center uppercase">EV Simulator</h1>
            </div>
            <div className="flex flex-row p-8 gap-8 items-center">
            <Controls controller={controller}/>
                {results && <Analysis results={results}/>}
                {!results &&
                    <div className="w-3/4 h-3/4">
                        <p className="text-center text-2xl">No results yet, click on Submit</p>
                    </div>
                }
            </div>
        </div>
    );
}

export default EVSim;