import React from 'react'


interface GroupProps {
    label?: string;
    children: React.ReactNode;
    layout?: 'horizontal' | 'vertical';
    className?: string;
}

const Group: React.FC<GroupProps> = ({label, children, layout = 'vertical', className = ''}) => {
    return (
        <div className="flex flex-col gap-0">
            {label && <label className="text-sm text-gray-500">{label}</label>}
            <div
                className={`flex flex-${layout === 'vertical' ? 'col' : 'row'}
                        gap-4 p-4 rounded-md border border-gray-200 hover:shadow
                        backdrop-blur-lg
                        ${className}`}>
                {children}
            </div>
        </div>
    );
};

export default Group;