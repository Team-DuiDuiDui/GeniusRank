import { LoadingOverlay, Tooltip } from '@mantine/core';
import CardWithNoShrink from '../constant/cardWithNoShrink';
import '../../../node_modules/flag-icons/css/flag-icons.min.css';
import { InfoIcon } from '../constant/info';
import { InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { FetcherWithComponents } from '@remix-run/react';
import { UserDetail } from '~/api/github/graphql/typings/user';
import { useEffect, useState } from 'react';
// import { interpolateColorsOfIcon } from '~/utils/chore';

interface NationCardProps {
    fetcher?: FetcherWithComponents<unknown>;
    userData?: Pick<UserDetail, 'followers' | 'following' | 'login'>;
    nationISO: string;
    nationLocale: string;
    isStillHim?: boolean;
    message: string | React.ReactNode;
    confidence?: number;
    disable?: boolean;
}

const UserNation: React.FC<NationCardProps> = ({
    fetcher,
    userData,
    nationISO,
    nationLocale,
    isStillHim,
    disable,
    message,
}) => {
    const noData = nationISO === '';
    const isCN = nationISO === 'CN';
    const [loading, setLoading] = useState(isStillHim);
    useEffect(() => {
        if (isStillHim && fetcher?.data && loading) setLoading(false);
    }, [fetcher?.data, isStillHim, loading]);
    const { t } = useTranslation();
    const renderIcon = () => {
        if (disable) return;

        if (noData && fetcher)
            return (
                <fetcher.Form
                    method="post"
                    onSubmit={() => {
                        fetcher.submit(
                            {},
                            {
                                action: '/reset-fetcher',
                            }
                        );
                        setLoading(true);
                    }}>
                    <input type="hidden" name="userData" value={JSON.stringify(userData)} />
                    <Tooltip label={t('user.reload_nation')}>
                        <button
                            className="absolute w-6 h-6 top-3 right-3 bg-white/90 backdrop-blur-md rounded-full shadow-md flex justify-center items-center"
                            name="reload-nation"
                            value="reload"
                            type="submit">
                            <ReloadOutlined className="text-red-500" />
                        </button>
                    </Tooltip>
                </fetcher.Form>
            );

        return (
            <Tooltip label={message}>
                <div className="absolute w-6 h-6 top-3 right-3 bg-white/90 backdrop-blur-md rounded-full shadow-md flex justify-center items-center">
                    <InfoCircleOutlined />
                </div>
            </Tooltip>
        );
    };

    const renderMiddleInfo = () => {
        if (isCN) return;

        if (noData)
            return (
                <>
                    <div
                        className=" shadow-md rounded-full border h-full bg-white/70 backdrop-blur-md aspect-square flex flex-col items-center justify-center"
                        style={{ borderColor: '#39c5bb' }}>
                        <InfoIcon color="red" />
                        <div className=" text-base drop-shadow-md font-bold text-red-600">
                            {t('user.err.something_wrong_shorter')}
                        </div>
                        <div className=" text-base drop-shadow-md font-bold text-red-600 text-center">
                            {t('user.err.click_to_reload')}
                        </div>
                    </div>
                </>
            );

        if (disable)
            return (
                <>
                    <div
                        className=" shadow-md rounded-full border h-full bg-white/70 backdrop-blur-md aspect-square flex flex-col items-center justify-center"
                        style={{ borderColor: '#39c5bb' }}>
                        <InfoIcon color="red" />
                        <div className=" text-base drop-shadow-md font-bold text-red-600">
                            {t('user.info.login_to_see_l1')}
                        </div>
                        <div className=" text-base drop-shadow-md font-bold text-red-600">
                            {t('user.info.login_to_see_l2')}
                        </div>
                    </div>
                </>
            );

        return (
            <>
                <div
                    className=" shadow-md rounded-full border h-full bg-white/70 backdrop-blur-md aspect-square flex flex-col items-center justify-center"
                    style={{ borderColor: '#39c5bb' }}>
                    <span
                        className={`w-8 h-6 bg-no-repeat bg-center rounded-sm border fi-${nationISO.toLocaleLowerCase()}`}
                    />
                    <div className=" text-base drop-shadow-md font-bold">{nationLocale}</div>
                </div>
            </>
        );
    };

    const renderFlag = () => (
        <span
            className={` bg-no-repeat bg-center absolute top-0 left-0 fi-${nationISO.toLocaleLowerCase()} ${
                disable ? 'blur-xl' : ''
            } p-0 h-full w-full ${nationISO !== 'CN' ? 'blur scale-95' : ''}`}></span>
    );

    return (
        <CardWithNoShrink
            containerClass={`overflow-hidden h-full aspect-[4/3] shrink-0`}
            containerClassDelete={['p-8']}>
            {loading && <LoadingOverlay visible={loading} loaderProps={{ type: 'dots' }} />}
            {renderFlag()}
            <div className={`h-full w-full flex items-center justify-center p-4`}>
                {renderIcon()}
                {!isCN && renderMiddleInfo()}
            </div>
        </CardWithNoShrink>
    );
};

export default UserNation;
