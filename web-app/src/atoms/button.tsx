import React from "react";

interface ButtonProps {
    label?: string;
    icon?: string;
    disabled?: boolean;
    onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({label, icon, disabled = false, onClick}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`bg-primary text-white bg-opacity-70 hover:bg-opacity-100 active:scale-95
                  px-4 py-2 rounded-full flex items-center justify-center spacing-2
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
            {icon && <i className={icon}/>}
            {label && <span>{label}</span>}
        </button>
    );
};

export default Button;
