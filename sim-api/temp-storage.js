const fs = require("fs");
const path = require("path");
const os = require("os");

const TEMP_FILE_PATH = path.join(os.tmpdir(), "simulation_temp.json");

const readData = () => {
    const data = fs.readFileSync(TEMP_FILE_PATH, "utf-8");
    return JSON.parse(data);
};

// Write data to storage
const writeData = (data) => {
    fs.writeFileSync(TEMP_FILE_PATH, JSON.stringify(data, null, 2));
};

// Shenanigans to create the file if it doesn't exist
if (!fs.existsSync(TEMP_FILE_PATH)) {
    const initialData = {inputs: [], results: []};
    writeData(initialData);
}


module.exports = {readData, writeData, TEMP_FILE_PATH};
