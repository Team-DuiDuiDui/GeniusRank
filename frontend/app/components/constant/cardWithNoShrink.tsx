import React from 'react'

interface cardWithNoShrinkProps {
    containerClass?: string
    style?: React.CSSProperties
    children: React.ReactNode
}

const CardWithNoShrink: React.FC<cardWithNoShrinkProps> = ({ containerClass, children }) => {
    return (
        <div className={`flex flex-col bg-white p-8 rounded-xl border shadow-md relative border-slate-200 ${containerClass}`}>
            {children}
        </div>
    );
}

export default CardWithNoShrink;