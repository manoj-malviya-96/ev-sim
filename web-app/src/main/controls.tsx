import Group from "../atoms/group";
import NumberInput from "../atoms/number-input";
import NumberSlider from "../atoms/number-slider";
import Button from "../atoms/button";
import React, {useEffect, useState} from "react";
import {EnergyConsumptionRate_kWH_per_100km, Percentage, Power_Kw} from "./types";
import {SimulationController} from "./simulator";


interface ControlsProps {
    controller: SimulationController; // Pass the controller as a prop
}

const Controls: React.FC<ControlsProps> = ({controller}) => {
    
    const [numberOfChargePoints, setNumberOfChargePoints] = useState<number>(20);
    const [chargePointPower, setChargePointPower] = useState<Power_Kw>(11);
    const [carPowerRating, setCarPowerRating] = useState<EnergyConsumptionRate_kWH_per_100km>(18);
    const [carArrivalProbabilityMultiplier, setCarArrivalProbabilityMultiplier] =
                    useState<Percentage>(100);
    
    
    useEffect(() => {
        controller.setChargePointsSimple(numberOfChargePoints, chargePointPower);
    }, [controller, numberOfChargePoints, chargePointPower]);
    
    useEffect(() => {
        controller.setCarPowerRating(carPowerRating);
    }, [controller, carPowerRating]);
    
    useEffect(() => {
        controller.setCarArrivalProbabilityMultiplier(carArrivalProbabilityMultiplier);
    }, [controller, carArrivalProbabilityMultiplier]);
    
    
    return (
        <div className="w-fit h-full flex flex-col gap-4 items-center">
            <Group label="Parking Lot">
                <NumberInput
                    label="Number of Charge Stations"
                    initialValue={numberOfChargePoints}
                    onChange={setNumberOfChargePoints}
                />
                <NumberInput
                    label="Power (kW)"
                    initialValue={chargePointPower}
                    onChange={setChargePointPower}
                />
            </Group>
            <Group label="External">
                <NumberSlider
                    label="Probability Multiplier"
                    initialValue={carArrivalProbabilityMultiplier}
                    max={200} min={20}
                    onChange={setCarArrivalProbabilityMultiplier}
                />
                <NumberInput
                    label="Car Power Rating (kWh)"
                    initialValue={carPowerRating}
                    onChange={setCarPowerRating}
                />
            </Group>
            <Button
                label="Submit"
                onClick= {() => controller.simulate()}
            />
        </div>
    )
}


export default Controls;