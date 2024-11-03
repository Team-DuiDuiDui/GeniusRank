/* eslint-disable import/no-named-as-default-member */
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Popover } from '@mantine/core';
import axios, { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { ZodError } from 'zod';
import { BackEndError } from '~/hooks/useAxiosInstanceForBe';

interface ErrorProps {
    error: AxiosError | ZodError | unknown | null;
    reload?: () => void;
}

const ErrorNote: React.FC<ErrorProps> = ({ error, reload }) => {
    const { t } = useTranslation();
    return (
        <>
            {error ? (
                <span className="mx-2">
                    <Popover width={500} position="bottom" withArrow shadow="md">
                        <Popover.Target>
                            <ExclamationCircleOutlined className="text-red-500 hover:scale-110 active:scale-90 transition-all" />
                        </Popover.Target>
                        <Popover.Dropdown className="flex items-center justify-center flex-col gap-2">
                            <p className="text-base font-bold">
                                {axios.isAxiosError(error)
                                    ? t('user.err.network_error')
                                    : error instanceof ZodError
                                    ? t('user.err.parse_error')
                                    : t('user.err.something_wrong')}
                            </p>
                            <p className="text-xs self-start">
                                <span className="font-bold">{t('user.err.may_reason')}</span>
                                {axios.isAxiosError(error)
                                    ? error.status === 403
                                        ? t('user.err.rate_limit')
                                        : error.status === 422
                                        ? t('user.err.may_hide')
                                        : t('user.no_message')
                                    : error instanceof BackEndError
                                    ? error.error
                                    : t('user.no_message')}
                            </p>
                            <p className="text-xs self-start">
                                <span className="font-bold">{t('user.err.message')}</span>
                                {(error as { message?: string })?.message ?? t('user.no_message')}
                            </p>
                            <p className="text-xs self-start">
                                <span className="font-bold">{t('user.err.may_help')}</span>
                                {axios.isAxiosError(error)
                                    ? (error.response?.data as { message?: string }).message ?? t('user.no_message')
                                    : error instanceof ZodError
                                    ? JSON.stringify(error.flatten().fieldErrors)
                                    : t('user.no_message')}
                            </p>
                            <Button onClick={reload}>{t('user.err.reload')}</Button>
                        </Popover.Dropdown>
                    </Popover>
                </span>
            ) : null}
        </>
    );
};

export default ErrorNote;
