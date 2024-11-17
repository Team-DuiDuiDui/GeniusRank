import { ReactNode } from 'react';
import { AxiosError } from 'axios';
import { BackEndError } from '~/hooks/useAxiosInstanceForBe';
import ErrorNote from '../error';
import CardWithNoShrink from '../../constant/cardWithNoShrink';

interface CardProps {
    title: string;
    children: ReactNode;
    error: null | AxiosError | BackEndError | unknown;
    isBackendRequest?: boolean;
}

export const Card = ({ title, children, error, isBackendRequest }: CardProps) => {
    return (
        <CardWithNoShrink containerClass="pt-0">
            <h2 className="text-lg font-bold top-0 my-4 bg-white dark:bg-slate-600 py-1 transition-all flex-shrink">
                {title}
                <span className="font-normal ml-4 text-base">
                    <ErrorNote error={error} isBackendRequest={isBackendRequest} />
                </span>
            </h2>
            <div className="overflow-y-auto h-full flex-grow scrollbar">{children}</div>
        </CardWithNoShrink>
    );
};
