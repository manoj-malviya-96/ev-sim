import fs = require("fs");
import path = require("path");
import os = require("os");
import {SimulationData} from "./types";


export const TEMP_FILE = path.join(os.tmpdir(), "simulation_temp.json");

export const readData = (): SimulationData => {
    const data = fs.readFileSync(TEMP_FILE, "utf-8");
    return JSON.parse(data);
};

export const writeData = (data: SimulationData) => {
    fs.writeFileSync(TEMP_FILE, JSON.stringify(data, null, 2));
};


// If the file doesn't exists aka first time shenanigan, we just make an empty one
if (!fs.existsSync(TEMP_FILE)) {
    writeData({inputs: [], results: []});
}
