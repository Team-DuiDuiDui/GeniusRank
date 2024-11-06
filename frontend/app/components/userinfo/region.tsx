import { LoadingOverlay, Tooltip } from '@mantine/core';
import CardWithNoShrink from '../constant/cardWithNoShrink';
import '../../../node_modules/flag-icons/css/flag-icons.min.css';
import { InfoIcon } from '../constant/info';
import { InfoCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { FetcherWithComponents } from '@remix-run/react';
import { UserDetail } from '~/api/github/graphql/typings/user';
// import { interpolateColorsOfIcon } from '~/utils/chore';

interface NationCardProps {
    fetcher?: FetcherWithComponents<unknown>;
    userData?: Pick<UserDetail, 'followers' | 'following' | 'login'>;
    nationISO: string;
    nationLocale: string;
    message: string | React.ReactNode;
    confidence?: number;
    loading?: boolean;
    disable?: boolean;
    warning?: string;
}

const UserNation: React.FC<NationCardProps> = ({
    fetcher,
    userData,
    nationISO,
    nationLocale,
    warning: _,
    loading,
    disable,
    message,
    // confidence,
}) => {
    const noData = nationISO === '';
    const isCN = nationISO === 'CN';
    const { t } = useTranslation();
    const renderIcon = () => {
        if (disable) return;

        if (noData && fetcher)
            return (
                <fetcher.Form method="post">
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
                        <div className=" text-base drop-shadow-md font-bold text-red-600">
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
            className={` bg-no-repeat bg-center absolute top-0 left-0 fi-${nationISO.toLocaleLowerCase()} ${disable ? 'blur-xl' : ''
                } p-0 h-full w-full ${nationISO !== 'CN' ? 'blur scale-95' : ''}`}></span>
    );

    // return (
    //     <>
    //         {isCN ? (
    //             <Tooltip label={message}>
    //                 <CardWithNoShrink
    //                     containerClass={`flex-shrink-0 flex-grow-0 overflow-hidden `}
    //                     containerClassDelete={['p-8']}>
    //                     {loading && <LoadingOverlay visible={loading} loaderProps={{ type: 'dots' }} />}
    //                     <span
    //                         className={` bg-no-repeat bg-center absolute top-0 left-0 fi-${nationISO.toLocaleLowerCase()} ${disable ? 'blur-xl' : ''
    //                             } p-0 h-full w-full ${nationISO !== 'CN' ? 'blur scale-95' : ''}`}></span>
    //                     <div
    //                         className={`h-full w-full flex items-center justify-center p-4 `}
    //                         style={{ aspectRatio: '4/3' }}>
    //                         {nationISO !== 'CN' && (
    //                             <div
    //                                 className=" shadow-md rounded-full border h-full bg-white/70 backdrop-blur-md aspect-square flex flex-col items-center justify-center"
    //                                 style={{ borderColor: '#39c5bb' }}>
    //                                 {disable ? (
    //                                     <>
    //                                         <InfoIcon color="red" />
    //                                         <div className=" text-base drop-shadow-md font-bold text-red-600">
    //                                             {t("user.info.login_to_see_l1")}
    //                                         </div>
    //                                         <div className=" text-base drop-shadow-md font-bold text-red-600">
    //                                             {t("user.info.login_to_see_l2")}
    //                                         </div>
    //                                     </>
    //                                 ) : (
    //                                     <>
    //                                         <span
    //                                             className={`w-8 h-6 bg-no-repeat bg-center rounded-sm border fi-${(
    //                                                 nationISO as string
    //                                             ).toLocaleLowerCase()}`}
    //                                         />
    //                                         <div className=" text-base drop-shadow-md font-bold">{nationLocale}</div>
    //                                     </>
    //                                 )}
    //                             </div>
    //                         )}
    //                     </div>
    //                 </CardWithNoShrink>
    //             </Tooltip>
    //         ) : (
    //             <CardWithNoShrink
    //                 containerClass={`flex-shrink-0 flex-grow-0 overflow-hidden `}
    //                 containerClassDelete={['p-8']}>
    //                 {loading && <LoadingOverlay visible={loading} loaderProps={{ type: 'dots' }} />}
    //                 <span
    //                     className={` bg-no-repeat bg-center absolute top-0 left-0 fi-${nationISO.toLocaleLowerCase()} ${disable ? 'blur-xl' : ''
    //                         } p-0 h-full w-full ${nationISO !== 'CN' ? 'blur scale-95' : ''}`}></span>
    //                 <div
    //                     className={`h-full w-full flex items-center justify-center p-4 `}
    //                     style={{ aspectRatio: '4/3' }}>
    //                     {disable ? (
    //                         <></>
    //                     ) : (
    //                         nationISO === ""
    //                             ?
    //                             <Tooltip label={message}>
    //                                 <div className="absolute w-6 h-6 top-3 right-3 bg-white/90 backdrop-blur-md rounded-full shadow-md flex justify-center items-center">
    //                                     <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M927.999436 531.028522a31.998984 31.998984 0 0 0-31.998984 31.998984c0 51.852948-10.147341 102.138098-30.163865 149.461048a385.47252 385.47252 0 0 1-204.377345 204.377345c-47.32295 20.016524-97.6081 30.163865-149.461048 30.163865s-102.138098-10.147341-149.461048-30.163865a385.47252 385.47252 0 0 1-204.377345-204.377345c-20.016524-47.32295-30.163865-97.6081-30.163865-149.461048s10.147341-102.138098 30.163865-149.461048a385.47252 385.47252 0 0 1 204.377345-204.377345c47.32295-20.016524 97.6081-30.163865 149.461048-30.163865a387.379888 387.379888 0 0 1 59.193424 4.533611l-56.538282 22.035878A31.998984 31.998984 0 1 0 537.892156 265.232491l137.041483-53.402685a31.998984 31.998984 0 0 0 18.195855-41.434674L639.723197 33.357261a31.998984 31.998984 0 1 0-59.630529 23.23882l26.695923 68.502679a449.969005 449.969005 0 0 0-94.786785-10.060642c-60.465003 0-119.138236 11.8488-174.390489 35.217667a449.214005 449.214005 0 0 0-238.388457 238.388457c-23.361643 55.252253-35.22128 113.925486-35.22128 174.390489s11.8488 119.138236 35.217668 174.390489a449.214005 449.214005 0 0 0 238.388457 238.388457c55.252253 23.368867 113.925486 35.217667 174.390489 35.217667s119.138236-11.8488 174.390489-35.217667A449.210393 449.210393 0 0 0 924.784365 737.42522c23.368867-55.270316 35.217667-113.925486 35.217667-174.390489a31.998984 31.998984 0 0 0-32.002596-32.006209z" fill="" ></path></svg>
    //                                 </div>
    //                             </Tooltip>
    //                             :
    //                             <Tooltip label={message}>
    //                                 <div className="absolute w-6 h-6 top-3 right-3 bg-white/90 backdrop-blur-md rounded-full shadow-md">
    //                                     <svg
    //                                         xmlns="http://www.w3.org/2000/svg"
    //                                         width="24"
    //                                         height="24"
    //                                         viewBox="0 0 24 24"
    //                                         fill="none">
    //                                         <g id="InfoOutlined">
    //                                             <path
    //                                                 id="Vector"
    //                                                 d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
    //                                                 fill={warning ? 'red' : 'black'}
    //                                                 fillOpacity="0.54"
    //                                             />
    //                                         </g>
    //                                     </svg>
    //                                 </div>
    //                             </Tooltip>
    //                     )}
    //                     {nationISO !== 'CN' && (
    //                         <div
    //                             className=" shadow-md rounded-full border h-full bg-white/70 backdrop-blur-md aspect-square flex flex-col items-center justify-center"
    //                             style={{ borderColor: '#39c5bb' }}>
    //                             {disable
    //                                 ?
    //                                 <>
    //                                     <InfoIcon color="red" />
    //                                     <div className=" text-base drop-shadow-md font-bold text-red-600">
    //                                         {t("user.info.login_to_see_l1")}
    //                                     </div>
    //                                     <div className=" text-base drop-shadow-md font-bold text-red-600">
    //                                         {t("user.info.login_to_see_l2")}
    //                                     </div>
    //                                 </>
    //                                 :
    //                                 nationISO === "" ?
    //                                     <>
    //                                         <InfoIcon color="red" />
    //                                         <div className=" text-base drop-shadow-md font-bold text-red-600">
    //                                             {t("user.err.something_wrong_shorter")}
    //                                         </div>
    //                                         <div className=" text-base drop-shadow-md font-bold text-red-600">
    //                                             {t("user.err.click_to_reload")}
    //                                         </div>
    //                                     </>
    //                                     :
    //                                     <>
    //                                         <span
    //                                             className={`w-8 h-6 bg-no-repeat bg-center rounded-sm border fi-${nationISO.toLocaleLowerCase()}`}
    //                                         />
    //                                         <div className=" text-base drop-shadow-md font-bold">{nationLocale}</div>
    //                                     </>
    //                             }
    //                         </div>
    //                     )}
    //                 </div>
    //             </CardWithNoShrink>
    //         )}
    //     </>
    // );
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
