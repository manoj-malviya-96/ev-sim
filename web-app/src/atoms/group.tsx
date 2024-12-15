import React from 'react'


interface GroupProps {
    label?: string;
    children: React.ReactNode;
    layout?: 'horizontal' | 'vertical';
    className?: string;
}

const _Group: React.FC<GroupProps> = ({label, children, layout = 'vertical', className = ''}) => {
    return (
        <div className="w-full flex flex-col gap-0">
            {label && <label className="text-sm text-gray-500">{label}</label>}
            <div
                className={`flex flex-${layout === 'vertical' ? 'col' : 'row'}
                        gap-4 p-4 rounded-md hover:shadow
                        bg-white bg-opacity-80
                        border border-gray-200
                        backdrop-blur-lg w-full h-fit
                        ${className}`}>
                {children}
            </div>
        </div>
    );
};

const Group = React.memo(_Group);
export default Group;