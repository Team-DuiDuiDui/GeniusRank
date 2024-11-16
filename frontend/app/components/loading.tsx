import { Loader, LoadingOverlay } from '@mantine/core';
import { useNavigation } from '@remix-run/react';
import { useTranslation } from 'react-i18next';

const LoadingLayout = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const getText = () => {
        switch (navigation.location?.pathname?.split('/')[1]) {
            case 'detail':
                return t('loading.detail');
            case 'user':
                return t('loading.user');
            default:
                return t('loading.common');
        }
    };
    return (
        <>
            <LoadingOverlay
                visible={navigation.state === 'loading'}
                className="items-start py-20 dark:hidden"
                zIndex={30}
                overlayProps={{ radius: 'sm', blur: 2, center: false }}
                loaderProps={{
                    children: (
                        <div className="flex flex-col justify-center items-center gap-4">
                            <Loader variant="dots" />
                            <p className="text-base text-gray-500">{getText()}</p>
                        </div>
                    ),
                }}
            />
            <LoadingOverlay
                visible={navigation.state === 'loading'}
                className="items-start py-20 dark:flex hidden"
                zIndex={30}
                overlayProps={{ radius: 'sm', blur: 2, center: false, color: 'rgb(30,41,59)' }}
                loaderProps={{
                    children: (
                        <div className="flex flex-col justify-center items-center gap-4">
                            <Loader variant="dots" />
                            <p className="text-base text-gray-500">{getText()}</p>
                        </div>
                    ),
                }}
            />
        </>
    );
};

export default LoadingLayout;
