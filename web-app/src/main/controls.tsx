import Group from "../atoms/group";
import NumberInput from "../atoms/number-input";
import NumberSlider from "../atoms/number-slider";
import Button from "../atoms/button";


const Controls = () => {
    return (
        <div className="w-fit h-full flex flex-col gap-4 items-center">
            <Group label="Parking Lot">
                <NumberInput
                    label="Number of Charge Stations"
                    initialValue={0}
                    onChange={(value) => console.log("Value changed to", value)}
                />
                <NumberInput
                    label="Power (kW)"
                    initialValue={0}
                    onChange={(value) => console.log("Value changed to", value)}
                />
            </Group>
            <Group label="External">
                <NumberSlider
                    label="Probability Multiplier"
                    initialValue={100}
                    max={200} min={20}
                    onChange={(value) => console.log("Value changed to", value)}/>
                <NumberInput
                    label="Car Power Rating (kWh)"
                    initialValue={18}
                    onChange={(value) => console.log("Value changed to", value)}
                />
            </Group>
            <Button
                label="Submit"
                onClick={() => console.log("Button clicked!")}
            />
        </div>
    )
}


export default Controls;