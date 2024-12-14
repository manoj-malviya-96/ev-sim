import React from "react";


interface StatsProps {
    label: string;
    icon?: string;
    value: number | string | undefined;
    className?: string;
}

const Stats: React.FC<StatsProps> = ({label, icon, value, className = ''}) => {
    return (
        <div className={`flex flex-col items-center shadow p-4 rounded-md ${className}`}>
            <span className="text-sm text-gray-800 items-center flex flex-row gap-2">
                {icon && <i className={icon}/>}
                {label}
            </span>
            <span className="text-2xl font-extrabold">{value}</span>
        </div>
    );
}

export default Stats;