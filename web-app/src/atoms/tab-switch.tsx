import React, { useEffect, useState } from "react";

interface TabItem {
    label: string;
    icon?: string;
}

interface TabSwitchButtonProps {
    tabs: TabItem[];
    className?: string;
    onSwitch: (index: number) => void;
}

const _TabSwitchButton: React.FC<TabSwitchButtonProps> = ({ tabs, className, onSwitch }) => {
    const [activeTab, setActiveTab] = useState<number>(0); // Active tab index
    
    useEffect(() => {
        onSwitch?.(activeTab);
    }, [onSwitch, activeTab]);
    
    return (
        <div className={`flex w-full h-full items-center justify-center ${className}`}>
            <div className="flex">
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`px-4 py-2 ${
                            activeTab === index
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-700"
                        }
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

const TabSwitchButton = React.memo(_TabSwitchButton);
export default TabSwitchButton;
