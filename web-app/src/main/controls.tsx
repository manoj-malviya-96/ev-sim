import Group from "../atoms/group";
import NumberInput from "../atoms/number-input";
import NumberSlider from "../atoms/number-slider";
import React, {useEffect, useState} from "react";
import {EnergyConsumptionRate_kWH_per_100km, Percentage, Power_Kw} from "./types";
import {SimulationController} from "./simulator";
import TabSwitchButton from "../atoms/tab-switch";
import Button from "../atoms/button";


interface ControlsProps {
    controller: SimulationController; // Pass the controller as a prop
}

const Controls: React.FC<ControlsProps> = ({controller}) => {
    
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    
    const [numberOfChargePoints, setNumberOfChargePoints] =
        useState<number>(controller.chargePointsProps.numberOfChargePoints);
    
    const [chargePointPower, setChargePointPower] =
        useState<Power_Kw>(controller.chargePointsProps.power);
    
    const [carPowerRating, setCarPowerRating] =
        useState<EnergyConsumptionRate_kWH_per_100km>(controller.carPowerRating);
    
    const [carArrivalProbabilityMultiplier, setCarArrivalProbabilityMultiplier] =
        useState<Percentage>(controller.carArrivalProbabilityMultiplier);
    
    useEffect(() => {
        controller.setChargePointsSimple({
            numberOfChargePoints: numberOfChargePoints,
            power: chargePointPower,
        });
    }, [controller, numberOfChargePoints, chargePointPower]);
    
    useEffect(() => {
        controller.carPowerRating= carPowerRating;
    }, [controller, carPowerRating]);
    
    useEffect(() => {
        controller.carArrivalProbabilityMultiplier = carArrivalProbabilityMultiplier;
    }, [controller, carArrivalProbabilityMultiplier]);
    
    // Sync states with controller when backend updates occur
    useEffect(() => {
        const updateStatesFromController = () => {
            setNumberOfChargePoints(controller.chargePointsProps.numberOfChargePoints);
            setChargePointPower(controller.chargePointsProps.power);
            setCarPowerRating(controller.carPowerRating);
            setCarArrivalProbabilityMultiplier(controller.carArrivalProbabilityMultiplier);
        };
        
        controller.addUpdateListener(updateStatesFromController);
        
        return () => controller.removeUpdateListener(updateStatesFromController);
    }, [controller]);
    
    
    return (
        <div className="w-fit h-full flex flex-col gap-4 items-center">
            
            <Group label="Parking Lot">
                <TabSwitchButton
                    tabs={[{label: "Simple"}, {label: "Advanced"}]}
                    onSwitch={(index) => setShowAdvanced((
                        index === 1
                    ))}
                />
                {!showAdvanced && (
                    <>
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
                    </>
                )}
                {showAdvanced && (
                    <>
                        <NumberInput
                            label="Charge Station"
                            initialValue={numberOfChargePoints}
                            onChange={setNumberOfChargePoints}
                        />
                    </>
                )}
            </Group>
            {/* External */}
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
                onClick={() => controller.simulate()}
            />
        </div>
    )
}


export default Controls;