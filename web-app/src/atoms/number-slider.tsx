import React, {useEffect} from "react";

interface NumberSlider {
    initialValue: number;
    label?: string;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
}

const NumberSlider: React.FC<NumberSlider> = ({
                                                  label,
                                                  initialValue,
                                                  onChange,
                                                  min = 0,
                                                  max = 100,
                                                  step = 1,
                                                  className = "",
                                              }) => {
    
    const [value, setValue] = React.useState<number>(initialValue);
    const handleChange = (e: any) => {
        const num = Number(e.target.value);
        if (isNaN(num) || num === value) {
            return;
        }
        setValue(num);
    }
    
    useEffect(() => {
        onChange(value);
    }, [value]);
    
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
                className="slider w-full"
            />
            <div className="flex justify-between text-sm mt-1">
                <span>{min}</span>
                <span>{value}</span>
                <span>{max}</span>
            </div>
        </div>
    );
};

export default NumberSlider;
