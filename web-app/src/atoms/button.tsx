import React from 'react'

interface ButtonProps {
    label?: string
    icon?: string
    onClick: () => void
}


const Button: React.FC<ButtonProps> = ({label, icon, onClick}) => {
    return (
        <button
            onClick={onClick}
            className="p-2 bg-green-200 hover:bg-green-400 active:scale-95
                        rounded-full flex items-center spacing-2"
        >
            {icon && <i className={icon}/>}
            {label && <span className="ml-2">{label}</span>}
        </button>
    )
}

export default Button

