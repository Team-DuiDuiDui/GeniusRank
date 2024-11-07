import React from 'react'
import CardWithNoShrink from './cardWithNoShrink'

interface cardWithScrollProps {
    maxHeight: string
    children: React.ReactNode
}

const CardWithScroll: React.FC<cardWithScrollProps> = ({ maxHeight, children }) => {
    return (
        <CardWithNoShrink containerClass={`${maxHeight} overflow-y-auto pt-0 scrollbar`}>
            {children}
        </CardWithNoShrink>
    )
}

export default CardWithScroll;