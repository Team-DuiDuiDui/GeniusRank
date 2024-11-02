import { Loader, Table } from '@mantine/core';
import { ReactNode, useRef } from 'react';
import CardWithScroll from '../../constant/cardWithScroll';
import { throttleWithDeepClone } from '~/utils/chore';
import { useTranslation } from 'react-i18next';

interface DataTableProps<T> {
    title: string;
    columns: string[];
    data: T[];
    dataCount: number;
    renderRow: (item: T, index: number) => ReactNode;
    reverse?: boolean;
}

const CardWithScrollableTableDetail = <T,>({
    title,
    columns,
    data,
    dataCount,
    renderRow,
    reverse = false,
}: DataTableProps<T>) => {
    const titleRef = useRef(null);
    const headerRef = useRef<HTMLHeadingElement>(null);
    const { t } = useTranslation();
    const finalData = reverse ? [...data].reverse() : data;

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
                <span className="font-normal ml-4 text-base" ref={titleRef}>
                    {!data ? <Loader size={16} /> : `${data?.length ?? '_'} / ${dataCount ?? '_'}`}
                </span>
            </h2>
            <div className="overflow-y-auto max-h-max flex-grow scrollbar" onScroll={handleScroll}>
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
                            finalData.map((item, index) => renderRow(item, index))
                        ) : (
                            <Table.Tr className="text-center text-gray-500">
                                <Table.Td colSpan={columns.length}>{t('user.no_data')}</Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </div>
        </CardWithScroll>
    );
};

export default CardWithScrollableTableDetail;
