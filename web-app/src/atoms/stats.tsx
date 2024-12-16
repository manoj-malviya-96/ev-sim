import React from "react";

type Severity = 'good' | 'warning' | 'danger';

interface StatsProps {
    label: string;
    icon?: string;
    children?: React.ReactNode;
    severity?: Severity;
    value: number | string | undefined;
    units?: string;
    className?: string;
}

const computeTextColor = (severity: Severity | undefined) => {
    if (!severity) {
        return 'text-gray-800'; // Default text color
    }
    switch (severity) {
        case 'good':
            return 'text-green-600'; // Green for good
        case 'warning':
            return 'text-yellow-600'; // Yellow for warning
        case 'danger':
            return 'text-red-600'; // Red for danger
        default:
            return 'text-gray-800';
    }
};

const _Stats: React.FC<StatsProps> = ({label, icon, value, children, severity = 'good',units='', className = ''}) => {
    
    return (
        <div
            className={`flex flex-col px-4 py-2
                        hover:shadow bg-white backdrop-blur-lg
                        border border-black-50 bg-opacity-50 ${className}`}
        >
            <div className="flex flex-row w-full justify-between items-center">
                <div className="flex flex-col">
                <span className="text-md">
                    {label}
                </span>
                    <span className={`text-2xl font-extrabold ${computeTextColor(severity)}`}>
                        {`${value} ${units}`}</span>
                </div>
                {icon && <i className={`${icon} text-3xl ${computeTextColor(severity)}`}/>}
            </div>
            
            
            <div className={`flex gap-2 h-full w-full
                            justify-center items-center`}>
                {children}
            </div>
        </div>
    );
};

const Stats = React.memo(_Stats);
export default Stats;
