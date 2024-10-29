import React from 'react'

interface cardWithNoShrinkProps {
    containerClass?: string
    children: React.ReactNode
}

const cardWithNoShrink: React.FC<cardWithNoShrinkProps> = ({ containerClass, children }) => {
    return (
        <div className={`flex flex-col w-full bg-white p-8 rounded-xl border border-slate-200 ${containerClass}`}>
            {children}
        </div>
    );
}

export default cardWithNoShrink;