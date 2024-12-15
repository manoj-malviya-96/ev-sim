import React, {useEffect, useState} from "react";

interface TabItem {
    label: string;
    icon?: string;
}

interface TabSwitchButtonProps {
    tabs: TabItem[];
    className?: string;
    onSwitch: (index: number) => void;
}

const TabSwitchButton: React.FC<TabSwitchButtonProps> = ({tabs, className, onSwitch}) => {
    const [activeTab, setActiveTab] = useState<number>(0); // Active tab index
    
    useEffect(() => {
        onSwitch?.(activeTab);
    }, [onSwitch, activeTab]);
    
    return (
        <div className={`w-full h-full ${className}`}>
            <div className="flex pb-2">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`px-4 py-2 ${
                            activeTab === index ?
                                "bg-primary text-white" :
                                "bg-gray-100 text-gray-700"}
                        ${index === 0 ? "rounded-l-md" : index === tabs.length - 1 ? "rounded-r-md" : ""}
                        hover:bg-gray-400 transition`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TabSwitchButton;
