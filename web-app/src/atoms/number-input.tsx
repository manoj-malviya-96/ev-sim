import React, {useEffect} from "react";

interface NumberInputProps {
    label?: string;
    initialValue: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
}

const _NumberInput: React.FC<NumberInputProps> = ({
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
        onChange(num);
    }
    
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);
    
    return (
        <div className={`flex flex-col ${className}`}>
            {label && <label className="text-sm font-medium">{label}</label>}
            <input
                type="number"
                value={value}
                onChange={handleChange}
                min={min}
                max={max}
                step={step}
                className="p-2 border rounded w-full h-full"
            />
        </div>
    );
};

const NumberInput = React.memo(_NumberInput);
export default NumberInput;
