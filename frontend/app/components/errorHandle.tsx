import { ExclamationCircleTwoTone, InfoCircleTwoTone } from '@ant-design/icons';
import { Button } from '@mantine/core';
import { isRouteErrorResponse, Link } from '@remix-run/react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

const ErrorHandle: React.FC<ErrorHandleProps> = ({ error, isUser = false }) => {
    const { t } = useTranslation();
    if (isRouteErrorResponse(error)) {
        if (error.status === 404 && isUser)
            return (
                <ErrorPage
                    t={t}
                    title={t('user.err.not_found_title')}
                    description={t('user.err.not_found_no_org')}
                    icon="Warning"
                />
            );
        else return <ErrorPage t={t} description={error.data} />;
    } else if (error instanceof Error) {
        console.error(error.stack);
        return <ErrorPage t={t} description={error.message} />;
    } else {
        return <ErrorPage t={t} description={t('errorCode.unknown')} />;
    }
};

export default ErrorHandle;

interface ErrorHandleProps {
    error: unknown;
    isUser?: boolean;
}

interface ErrorPageProps {
    title?: string;
    description: string;
    icon?: 'Error' | 'Warning';
    t: TFunction;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ title, description, icon = 'Error', t }) => {
    return (
        <div className="h-full py-16 flex justify-center items-center flex-col gap-6">
            {icon == 'Error' ? (
                <ExclamationCircleTwoTone twoToneColor={'#ff4d4f'} className="text-6xl" />
            ) : (
                <InfoCircleTwoTone twoToneColor={'#ffa940'} className="text-6xl" />
            )}
            <div className="flex flex-col justify-center items-center gap-2">
                <h1 className="text-2xl">{title ?? t('user.err.something_wrong')}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-300">{description}</p>
            </div>
            <div className="flex gap-4">
                <Link to="#" replace>
                    <Button>
                        <div className="flex gap-2 items-center justify-center text-base">{t('err.action.reload')}</div>
                    </Button>
                </Link>
                <Link to="/">
                    <Button variant="default">
                        <div className="flex gap-2 items-center justify-center text-base">{t('oauth.err.back')}</div>
                    </Button>
                </Link>
            </div>
        </div>
    );
};
