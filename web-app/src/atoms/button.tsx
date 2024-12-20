import React from "react";

interface ButtonProps {
    label?: string;
    icon?: string;
    danger?: boolean;
    disabled?: boolean;
    onClick: () => void;
}

const _Button: React.FC<ButtonProps> = ({label, icon, disabled = false, danger = false, onClick}) => {
    
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${danger ? 'bg-transparent' : 'bg-primary'}
                text-white hover:scale-105 active:scale-95 transition duration-300
                  ${label ? 'px-4' : 'px-2'} py-1 rounded-full flex items-center justify-center spacing-2
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {icon && <i className={`${icon} ${danger ? 'text-red-600': ''}`}/>}
            {label && <span>{label}</span>}
        </button>
    );
};

const Button = React.memo(_Button);
export default Button;
