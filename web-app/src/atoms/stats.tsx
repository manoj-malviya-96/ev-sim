import React from "react";

type Severity = 'good' | 'warning' | 'danger';

interface StatsProps {
    label: string;
    icon?: string;
    info?: string;
    children?: React.ReactNode;
    severity?: Severity;
    value: number | string | undefined;
    className?: string;
}

const computeBgColor = (severity: Severity | undefined) => {
    if (!severity) {
        return 'bg-white';
    }
    switch (severity) {
        case 'good':
            return 'bg-white';
        case 'warning':
            return 'bg-yellow-400';
        case 'danger':
            return 'bg-red-400';
        default:
            return 'bg-primary';
    }
}

const Stats: React.FC<StatsProps> = ({label, icon, value, info, children, severity = 'good', className = ''}) => {
    return (
        <div className={`flex flex-col items-center shadow p-4
                        rounded-md ${computeBgColor(severity)} bg-opacity-50 ${className}`}>
            <span className="text-sm text-gray-800 items-center flex flex-row gap-2">
                {icon && <i className={icon}/>}
                {label}
            </span>
            <span className="text-2xl font-extrabold">{value}</span>
            {info &&
                (
                    <span className="text-sm text-gray-800 items-center flex flex-row gap-2">
                {info}
                </span>
                )
            }
            {children}
        </div>
    );
}

export default Stats;