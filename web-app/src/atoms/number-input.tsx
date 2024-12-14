import React, {ChangeEvent, ChangeEventHandler, useCallback, useEffect} from "react";

interface NumberInputProps {
    label?: string;
    initialValue: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
}

const NumberInput: React.FC<NumberInputProps> = ({
                                                     label,
                                                     initialValue,
                                                     onChange,
                                                     min,
                                                     max,
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
                type="number"
                value={value}
                onChange={handleChange}
                min={min}
                max={max}
                step={step}
                className="p-2 border rounded"
            />
        </div>
    );
};

export default NumberInput;
