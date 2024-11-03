import { ReactNode, useRef } from 'react';
import CardWithScroll from '../constant/cardWithScroll';
import { throttleWithDeepClone } from '~/utils/chore';

interface CardProps {
    title: string;
    children: ReactNode;
}

const CardScrollable = ({ title, children }: CardProps) => {
    const headerRef = useRef<HTMLHeadingElement>(null);

    const handleScroll = throttleWithDeepClone((event: React.UIEvent<HTMLDivElement>) => {
        if (event.currentTarget.scrollTop > 0) {
            event.preventDefault();
            headerRef.current?.classList.remove('my-4', 'text-lg');
            headerRef.current?.classList.add('text-base', 'my-[2px]');
        } else {
            headerRef.current?.classList.remove('text-base', 'my-[2px]');
            headerRef.current?.classList.add('my-4', 'text-lg');
        }
    }, 100);

    return (
        <CardWithScroll maxHeight="max-h-96">
            <h2 className="text-lg font-bold top-0 my-4 bg-white py-1 transition-all flex-shrink" ref={headerRef}>
                {title}
            </h2>
            <div className="overflow-y-auto max-h-max flex-grow scrollbar" onScroll={handleScroll}>
                {children}
            </div>
        </CardWithScroll>
    );
};

export default CardScrollable;
