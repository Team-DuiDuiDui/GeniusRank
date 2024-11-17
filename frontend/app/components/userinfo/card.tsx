import { ReactNode, useRef } from 'react';
import CardWithScroll from '../constant/cardWithScroll';
import { throttleWithDeepClone } from '~/utils/perform';
import { AxiosError } from 'axios';
import { BackEndError } from '~/hooks/useAxiosInstanceForBe';
import ErrorNote from './error';
import { Loader } from '@mantine/core';
import CardWithNoShrink from '../constant/cardWithNoShrink';

interface CardProps {
    title: string;
    children: ReactNode;
    data: unknown;
    error: null | AxiosError | BackEndError | unknown;
    isBackendRequest?: boolean;
    reload: () => void;
}

const CardScrollable = ({ title, children, data, error, reload, isBackendRequest }: CardProps) => {
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
                <span className="font-normal ml-4 text-base">
                    {!data && !error && <Loader size={16} />}
                    <ErrorNote error={error} reload={reload} isBackendRequest={isBackendRequest} />
                </span>
            </h2>
            <div className="overflow-y-auto h-full flex-grow scrollbar" onScroll={handleScroll}>
                {children}
            </div>
        </CardWithScroll>
    );
};

export const Card = ({ title, children, data, error, isBackendRequest, reload }: CardProps) => {
    return (
        <CardWithNoShrink containerClass="pt-0">
            <h2 className="text-lg font-bold top-0 my-4 bg-white dark:bg-slate-600 py-1 transition-all flex-shrink">
                {title}
                <span className="font-normal ml-4 text-base">
                    {!data && !error && <Loader size={16} />}
                    <ErrorNote error={error} reload={reload} isBackendRequest={isBackendRequest} />
                </span>
            </h2>
            <div className="overflow-y-auto h-full flex-grow scrollbar">{children}</div>
        </CardWithNoShrink>
    );
};

export default CardScrollable;
