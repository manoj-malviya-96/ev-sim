import * as express from "express";
import * as bodyParser from "body-parser";
import {readData, writeData} from "./temp-storage";
import {SimulationData, SimulationInput} from "./types";

const app = express();
app.use(bodyParser.json());

let database: SimulationData = readData();


app.post("/api/inputs", (req: express.Request, res: express.Response) => {
    const {
        uniform_NumChargePoints,
        uniform_ChargePointPower,
        carPowerRating,
        carArrivalProbabilityMultiplier,
    } = req.body;
    
    const newInput: SimulationInput = {
        id: Date.now(),
        uniform_NumChargePoints,
        uniform_ChargePointPower,
        carPowerRating,
        carArrivalProbabilityMultiplier,
    };
    
    database.inputs.push(newInput);
    writeData(database);
    res.status(201).json(newInput);
});

app.get("/api/inputs", (req: express.Request, res: express.Response) => {
    res.json(database.inputs);
});

app.put(
    "/api/inputs/:id",
    (req: express.Request, res: express.Response) => {
        const {id} = req.params;
        const {
            uniform_NumChargePoints,
            uniform_ChargePointPower,
            carPowerRating,
            carArrivalProbabilityMultiplier,
        } = req.body;
        
        const inputIndex = database.inputs.findIndex(
            (input) => input.id === Number(id)
        );
        if (inputIndex === -1) {
            return res.status(404).json({error: "Input not found"});
        }
        
        database.inputs[inputIndex] = {
            ...database.inputs[inputIndex],
            uniform_NumChargePoints,
            uniform_ChargePointPower,
            carPowerRating,
            carArrivalProbabilityMultiplier,
        };
        
        writeData(database);
        return res.json(database.inputs[inputIndex]);
    }
);

app.delete("/api/inputs/:id", (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    
    const inputIndex = database.inputs.findIndex((input) => input.id === Number(id));
    if (inputIndex === -1) {
        return res.status(404).json({error: "Input not found"});
    }
    
    database.inputs.splice(inputIndex, 1);
    writeData(database);
    res.json({message: "Input deleted successfully"});
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
