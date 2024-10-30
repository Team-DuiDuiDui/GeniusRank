import { Loader, Skeleton, Table } from '@mantine/core';
import { ReactNode, useCallback, useRef } from 'react';
import ErrorNote from './error';
import CardWithScroll from '../constant/cardWithScroll';
import { AxiosError } from 'axios';
import { ZodError } from 'zod';
import { throttleWithDeepClone } from '~/utils/chore';

interface DataTableProps<T> {
    title: string;
    columns: string[];
    data: T[] | null | undefined;
    dataCount: number;
    renderRow: (item: T, index: number) => ReactNode;
    error: null | AxiosError | ZodError | unknown;
    reload: () => void;
}

const CardWithScrollableTable = <T,>({
    title,
    columns,
    data,
    dataCount,
    renderRow,
    error,
    reload,
}: DataTableProps<T>) => {
    const titleRef = useRef(null);
    const headerRef = useRef<HTMLHeadingElement>(null);

    const handleScroll = throttleWithDeepClone((event: React.UIEvent<HTMLDivElement>) => {
        console.log(event.currentTarget.scrollTop);
        if (event.currentTarget.scrollTop > 0) {
            event.preventDefault();
            headerRef.current?.classList.remove('my-4', 'text-lg');
            headerRef.current?.classList.add('text-base', 'my-[2px]');
        } else {
            headerRef.current?.classList.remove('text-base', 'my-[2px]');
            headerRef.current?.classList.add('my-4', 'text-lg');
        }
    }, 200);

    return (
        <CardWithScroll maxHeight="max-h-96">
            <h2 className="text-lg font-bold top-0 my-4 bg-white py-1 transition-all flex-shrink" ref={headerRef}>
                {title}
                <span className="font-normal ml-4 text-base" ref={titleRef}>
                    {!data && !error ? <Loader size={16} /> : `${data?.length ?? '_'} / ${dataCount ?? '_'}`}
                    <ErrorNote error={error} reload={reload} />
                </span>
            </h2>
            <div className="overflow-y-auto max-h-max flex-grow scrollbar" onScroll={handleScroll}>
                {data ? (
                    <Table className="w-full" horizontalSpacing="sm" verticalSpacing="sm" striped>
                        <Table.Thead>
                            <Table.Tr className="mb-6 sticky top-0 font-normal bg-white pb-3">
                                {columns.map((column, index) => (
                                    <Table.Th key={index}>{column}</Table.Th>
                                ))}
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data.length > 0 ? (
                                data.map((item, index) => renderRow(item, index))
                            ) : (
                                <tr className="text-center text-gray-500">
                                    <td colSpan={columns.length}>No data available</td>
                                </tr>
                            )}
                        </Table.Tbody>
                    </Table>
                ) : (
                    <Skeleton height={208} animate={!error} />
                )}
            </div>
        </CardWithScroll>
    );
};

export default CardWithScrollableTable;
