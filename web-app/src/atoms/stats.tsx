import React from "react";

type Severity = 'good' | 'warning' | 'danger';
interface StatsProps {
    label: string;
    icon?: string;
    severity?: Severity;
    value: number | string | undefined;
    className?: string;
}

const computeBgColor = (severity: Severity | undefined) => {
    if (!severity) {
        return 'bg-primary';
    }
    switch (severity) {
        case 'good':
            return 'bg-primary';
        case 'warning':
            return 'bg-yellow-400';
        case 'danger':
            return 'bg-red-400';
        default:
            return 'bg-primary';
    }
}

const Stats: React.FC<StatsProps> = ({label, icon, value, severity = 'good', className = ''}) => {
    return (
        <div className={`flex flex-col items-center shadow p-4
                        rounded-md ${computeBgColor(severity)} bg-opacity-50 ${className}`}>
            <span className="text-sm text-gray-800 items-center flex flex-row gap-2">
                {icon && <i className={icon}/>}
                {label}
            </span>
            <span className="text-2xl font-extrabold">{value}</span>
        </div>
    );
}

export default Stats;