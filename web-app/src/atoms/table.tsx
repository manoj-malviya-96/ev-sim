import React from "react";
import NumberInput from "./number-input";
import Button from "./button";

interface TableProps {
    headers: string[];
    initialValues?: number[][];
    onChange: (values: number[][]) => void;
    className?: string;
}

const _InputTable: React.FC<TableProps> = ({
                                              headers,
                                              initialValues = [],
                                              onChange,
                                              className = "",
                                          }) => {
    const [values, setValues] = React.useState<number[][]>(
        initialValues.length > 0
            ? initialValues
            : [Array(headers.length).fill(0)]
    );
    
    const handleAddRow = () => {
        setValues([...values, Array(headers.length).fill(0)]);
    };
    
    const handleDeleteRow = (rowIndex: number) => {
        const updatedValues = values.filter((_, index) => index !== rowIndex);
        setValues(updatedValues);
        onChange(updatedValues);
    };
    
    const handleCellChange = (rowIndex: number, colIndex: number, newValue: number) => {
        const updatedValues = [...values];
        updatedValues[rowIndex][colIndex] = newValue;
        setValues(updatedValues);
        onChange(updatedValues);
    };
    
    return (
        <div className={`${className}`}>
            <table className="w-full text-sm">
                <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th
                            key={index}
                            className="text-left text-sm font-normal"
                        >
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {values.map((row, rowIndex) => (
                    <tr key={rowIndex} className="w-full">
                        {row.map((value, colIndex) => (
                            <td key={colIndex}>
                                
                                <NumberInput
                                    className="w-full"
                                    initialValue={value}
                                    onChange={(newValue) =>
                                        handleCellChange(rowIndex, colIndex, newValue)
                                    }
                                />
                            </td>
                        ))}
                        <td className="text-center">
                            <Button
                                onClick={() => handleDeleteRow(rowIndex)}
                                danger={true}
                                icon="fas fa-trash"
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-2 flex justify-end">
                <Button onClick={handleAddRow} icon="fas fa-plus"/>
            </div>
        </div>
    );
};

const InputTable = React.memo(_InputTable);
export default InputTable;
