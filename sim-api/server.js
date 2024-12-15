const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const {readData, writeData, TEMP_FILE_PATH} = require("./temp-storage");


// Todo can we use TS for this? Right now for simplicity I am using JS.
const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

console.log("TEMP_FILE_PATH", TEMP_FILE_PATH);

let database = readData(); // Load stored data

// Create a new input
app.post("/api/inputs", (req, res) => {
    const {
        uniform_NumChargePoints,
        uniform_ChargePointPower,
        carPowerRating,
        carArrivalProbabilityMultiplier,
    } = req.body;

    const newInput = {
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

// Get all inputs
app.get("/api/inputs", (req, res) => {
    res.json(database.inputs);
});

// Update an input by ID
app.put("/api/inputs/:id", (req, res) => {
    const {id} = req.params;
    const {
        uniform_NumChargePoints,
        uniform_ChargePointPower,
        carPowerRating,
        carArrivalProbabilityMultiplier,
    } = req.body;

    const inputIndex = database.inputs.findIndex((input) => input.id === Number(id));
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
    res.json(database.inputs[inputIndex]);
});

// Delete an input by ID
app.delete("/api/inputs/:id", (req, res) => {
    const {id} = req.params;

    const inputIndex = database.inputs.findIndex((input) => input.id === Number(id));
    if (inputIndex === -1) {
        return res.status(404).json({error: "Input not found"});
    }

    database.inputs.splice(inputIndex, 1);
    writeData(database);
    res.json({message: "Input deleted successfully"});
});

// Reset all inputs
app.delete("/api/inputs", (req, res) => {
    database.inputs = [];
    writeData(database);
    res.json({message: "All inputs deleted successfully"});
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
