import React from 'react';

interface cardWithNoShrinkProps {
    containerClass?: string;
    containerClassDelete?: string[];
    style?: React.CSSProperties;
    children: React.ReactNode;
}

const CardWithNoShrink: React.FC<cardWithNoShrinkProps> = ({
    containerClass,
    children,
    containerClassDelete,
    style,
}) => {
    let classString = `flex flex-col bg-white p-8 rounded-xl border shadow-md relative border-slate-200 dark:bg-slate-600 dark:border-slate-800 ${containerClass}`;
    containerClassDelete?.forEach((item) => {
        const regex = new RegExp(item + '\\s*', 'g');
        classString = classString.replace(regex, '');
    });
    return (
        <div className={classString} style={style}>
            {children}
        </div>
    );
};

export default CardWithNoShrink;
