import React from 'react'
import CardWithNoShrink from './cardWithNoShrink'

interface cardWithScrollProps {
    maxHeight: string
    children: React.ReactNode
}

const CardWithScroll: React.FC<cardWithScrollProps> = ({ maxHeight, children }) => {
    return (
        <CardWithNoShrink containerClass={`gap-4 ${maxHeight} overflow-y-auto`}>
            {children}
        </CardWithNoShrink>
    )
}

export default CardWithScroll;