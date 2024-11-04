import React from 'react'

interface cardWithNoShrinkProps {
    containerClass?: string
    containerClassDelete?: string[]
    style?: React.CSSProperties
    children: React.ReactNode
}

const CardWithNoShrink: React.FC<cardWithNoShrinkProps> = ({ containerClass, children, containerClassDelete }) => {
    let classString = `flex flex-col bg-white p-8 rounded-xl border shadow-md relative border-slate-200 ${containerClass}`
    containerClassDelete?.forEach((item) => {
        const regex = new RegExp(item + "\\s*", "g"); // 创建正则表达式，匹配单词和后面的空格
        classString = classString.replace(regex, "");
    });
    return (
        <div className={classString}>
            {children}
        </div>
    );
}

export default CardWithNoShrink;