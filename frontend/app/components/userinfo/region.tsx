import { LoadingOverlay, Tooltip } from '@mantine/core';
import CardWithNoShrink from '../constant/cardWithNoShrink';
import '../../../node_modules/flag-icons/css/flag-icons.min.css';
import { InfoIcon } from '../constant/info';

interface NationCardProps {
    nationISO: string;
    nationLocale: string;
    message: string;
    loading?: boolean;
    disable?: boolean;
    warning?: string;
}

const UserNation: React.FC<NationCardProps> = ({ nationISO, nationLocale, warning, loading, disable, message }) => {
    return (
        <>
            {nationISO === 'CN' ? (
                <Tooltip label={message}>
                    <CardWithNoShrink
                        containerClass={`flex-shrink-0 flex-grow-0 overflow-hidden `}
                        containerClassDelete={['p-8']}>
                        {loading && <LoadingOverlay visible={loading} loaderProps={{ type: 'dots' }} />}
                        <span
                            className={` bg-no-repeat bg-center absolute top-0 left-0 fi-${nationISO.toLocaleLowerCase()} ${
                                disable ? 'blur-xl' : ''
                            } p-0 h-full w-full ${nationISO !== 'CN' ? 'blur scale-95' : ''}`}></span>
                        <div
                            className={`h-full w-full flex items-center justify-center p-4 `}
                            style={{ aspectRatio: '4/3' }}>
                            {nationISO !== 'CN' && (
                                <div
                                    className=" shadow-md rounded-full border h-full bg-white/70 backdrop-blur-md aspect-square flex flex-col items-center justify-center"
                                    style={{ borderColor: '#39c5bb' }}>
                                    {disable ? (
                                        <>
                                            <InfoIcon color="red" />
                                            <div className=" text-base drop-shadow-md font-bold text-red-600">
                                                登录后查看猜测
                                            </div>
                                            <div className=" text-base drop-shadow-md font-bold text-red-600">
                                                的国籍相关信息
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <span
                                                className={`w-8 h-6 bg-no-repeat bg-center rounded-sm border fi-${(
                                                    nationISO as string
                                                ).toLocaleLowerCase()}`}
                                            />
                                            <div className=" text-base drop-shadow-md font-bold">{nationLocale}</div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </CardWithNoShrink>
                </Tooltip>
            ) : (
                <CardWithNoShrink
                    containerClass={`flex-shrink-0 flex-grow-0 overflow-hidden `}
                    containerClassDelete={['p-8']}>
                    {loading && <LoadingOverlay visible={loading} loaderProps={{ type: 'dots' }} />}
                    <span
                        className={` bg-no-repeat bg-center absolute top-0 left-0 fi-${nationISO.toLocaleLowerCase()} ${
                            disable ? 'blur-xl' : ''
                        } p-0 h-full w-full ${nationISO !== 'CN' ? 'blur scale-95' : ''}`}></span>
                    <div
                        className={`h-full w-full flex items-center justify-center p-4 `}
                        style={{ aspectRatio: '4/3' }}>
                        {disable ? (
                            <></>
                        ) : (
                            <Tooltip label={message}>
                                <div className="absolute w-6 h-6 top-3 right-3 bg-white/90 backdrop-blur-md rounded-full shadow-md">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none">
                                        <g id="InfoOutlined">
                                            <path
                                                id="Vector"
                                                d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                                                fill={warning ? 'red' : 'black'}
                                                fillOpacity="0.54"
                                            />
                                        </g>
                                    </svg>
                                </div>
                            </Tooltip>
                        )}
                        {nationISO !== 'CN' && (
                            <div
                                className=" shadow-md rounded-full border h-full bg-white/70 backdrop-blur-md aspect-square flex flex-col items-center justify-center"
                                style={{ borderColor: '#39c5bb' }}>
                                {disable ? (
                                    <>
                                        <InfoIcon color="red" />
                                        <div className=" text-base drop-shadow-md font-bold text-red-600">
                                            登录后查看猜测
                                        </div>
                                        <div className=" text-base drop-shadow-md font-bold text-red-600">
                                            的国籍相关信息
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span
                                            className={`w-8 h-6 bg-no-repeat bg-center rounded-sm border fi-${nationISO.toLocaleLowerCase()}`}
                                        />
                                        <div className=" text-base drop-shadow-md font-bold">{nationLocale}</div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </CardWithNoShrink>
            )}
        </>
    );
};

export default UserNation;
