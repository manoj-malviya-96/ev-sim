import React from "react";

interface AnalysisProps {
    className?: string;
}


const Analysis: React.FC<AnalysisProps> = ({className}) => {
    return (
        <div className={`w-full h-full border-2 ${className}`}>
            <h1>Analysis</h1>
        </div>
    );
}

export default Analysis;