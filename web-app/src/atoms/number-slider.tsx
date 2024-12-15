import React, {useEffect} from "react";

interface NumberSliderProps {
    initialValue: number;
    label?: string;
    onChange: (value: number) => void;
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
}

const NumberSlider: React.FC<NumberSliderProps> = ({
                                                       label,
                                                       initialValue,
                                                       onChange,
                                                       defaultValue=50,
                                                       min = 0,
                                                       max = 100,
                                                       step = 1,
                                                       className = "",
                                                   }) => {
    
    // Note: This is a copy of the NumberInput component with the input type changed to range
    // Todo: Refactor to use a single component with a prop for the input type
    const [value, setValue] = React.useState<number>(initialValue);
    const handleChange = (e: any) => {
        const num = Number(e.target.value);
        if (isNaN(num) || num === value) {
            return;
        }
        setValue(num);
        onChange(num);
    }

    const handleDoubleClick = () => {
        setValue(defaultValue);
        onChange(defaultValue);
    };
    
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    
    return (
        <div className={`flex flex-col ${className}`}>
            {label && <label className="text-sm font-medium mb-1">{label}</label>}
            <input
                type="range"
                value={value}
                onChange={handleChange}
                min={min}
                max={max}
                step={step}
                onDoubleClick={handleDoubleClick}
                className="slider w-full"
            />
            <div className="flex justify-between text-sm mt-1">
                <span>{min}</span>
                <span className='text-primary font-bold'>{value}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

export default NumberSlider;
