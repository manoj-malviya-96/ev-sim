import React from "react";

interface ButtonProps {
    label?: string;
    icon?: string;
    danger?: boolean;
    disabled?: boolean;
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({label, icon, disabled = false, danger = false, onClick}) => {
    
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${danger ? 'bg-red-400' : 'bg-primary'} text-white bg-opacity-70 hover:bg-opacity-100 active:scale-95
                  ${label ? 'px-4' : 'px-2'} py-1 rounded-full flex items-center justify-center spacing-2
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {icon && <i className={icon}/>}
            {label && <span>{label}</span>}
        </button>
    );
};

export default Button;
