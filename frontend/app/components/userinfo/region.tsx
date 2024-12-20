import { LoadingOverlay, Tooltip, useMantineColorScheme } from "@mantine/core";
import CardWithNoShrink from "../constant/cardWithNoShrink";
import "../../../node_modules/flag-icons/css/flag-icons.min.css";
import { InfoIcon } from "../constant/info";
import { InfoCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { FetcherWithComponents } from "@remix-run/react";
import { UserDetail } from "~/api/github/graphql/typings/user";
import { useEffect, useState } from "react";
import { hexToRgb, interpolateColors, RGBToHex } from "~/utils/color";

interface NationCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    fetcher?: FetcherWithComponents<unknown>;
    userData?: Pick<UserDetail, "followers" | "following" | "login">;
    nationISO: string;
    nationLocale: string;
    isStillHim?: boolean;
    message: string | React.ReactNode;
    confidence: number;
    disable?: boolean;
    className?: string;
}

const UserNation: React.FC<NationCardProps> = ({
    data,
    fetcher,
    nationISO,
    confidence,
    nationLocale,
    isStillHim,
    disable,
    message,
    className,
}) => {
    const noData = nationISO === "";
    const isCN = nationISO === "CN";
    const { colorScheme } = useMantineColorScheme() as unknown as { colorScheme: string };
    const [loading, setLoading] = useState(isStillHim);
    const infoColor = confidence ? RGBToHex(interpolateColors(colorScheme === "dark" ? ["#f87171", "#e7e5e4"].map(hexToRgb) : ["#991b1b", "#222222"].map(hexToRgb), confidence))
        : "";
    // console.log(infoColor)
    useEffect(() => {
        if (isStillHim && fetcher?.data && loading) setLoading(false);
    }, [fetcher?.data, isStillHim, loading]);
    const { t } = useTranslation();

    const renderIcon = () => {
        if (disable) return;

        if (noData && fetcher) {
            return (
                <fetcher.Form
                    method="post"
                    onSubmit={() => {
                        const formData = new FormData();
                        formData.append(
                            "userData",
                            JSON.stringify(data.regionParamCopy),
                        );
                        formData.append(
                            "dataFromBe",
                            JSON.stringify(data.nationData),
                        );
                        fetcher.submit(
                            formData,
                            {
                                method: "POST",
                            },
                        );
                        setLoading(true);
                    }}
                >
                    <input
                        type="hidden"
                        name="userData"
                        value={JSON.stringify(data.regionParamCopy)}
                    />
                    <input
                        type="hidden"
                        name="dataFromBe"
                        value={JSON.stringify(data.nationData)}
                    />
                    <Tooltip label={t("user.reload_nation")}>
                        <button
                            className="absolute w-6 h-6 top-3 right-3 bg-white/90 dark:bg-slate-800 dark:text-gray-200 backdrop-blur-md rounded-full shadow-md flex justify-center items-center"
                            name="reload-nation"
                            value="reload"
                            type="submit"
                        >
                            <ReloadOutlined className="text-red-500" />
                        </button>
                    </Tooltip>
                </fetcher.Form>
            );
        }

        return (
            <Tooltip label={message}>
                <div className="absolute w-6 h-6 top-3 right-3 bg-white/90 dark:bg-slate-800 backdrop-blur-md rounded-full shadow-md md:flex justify-center items-center hidden">
                    <InfoCircleOutlined style={{ color: infoColor }} />
                </div>
            </Tooltip>
        );
    };

    const renderMiddleInfo = () => {
        if (isCN || (confidence <= 0.2 && confidence > 0)) return;

        if (noData) {
            return (
                <>
                    <div
                        className=" shadow-md rounded-full border h-full bg-white/70 backdrop-blur-md aspect-square flex flex-col items-center justify-center"
                        style={{ borderColor: "#39c5bb" }}
                    >
                        <InfoIcon color="red" />
                        <div className=" md:text-base drop-shadow-md font-bold text-red-600 text-sm ">
                            {t("user.err.something_wrong_shorter")}
                        </div>
                        <div className=" md:text-base drop-shadow-md font-bold text-red-600 text-center text-sm">
                            {t("user.err.click_to_reload")}
                        </div>
                    </div>
                </>
            );
        }

        if (disable) {
            return (
                <>
                    <div
                        className=" shadow-md rounded-full border h-full bg-white/70 backdrop-blur-md aspect-square flex flex-col items-center justify-center"
                        style={{ borderColor: "#39c5bb" }}
                    >
                        <InfoIcon color="red" />
                        <div className="md:hidden block text-sm whitespace-nowrap">
                            {t("user.err.please_login")}
                        </div>
                        <div className="md:block hidden drop-shadow-md font-bold text-red-600 text-sm">
                            {t("user.info.login_to_see_l1")}
                        </div>
                        <div className="md:block hidden drop-shadow-md font-bold text-red-600 text-sm">
                            {t("user.info.login_to_see_l2")}
                        </div>
                    </div>
                </>
            );
        }

        return (
            <>
                <div
                    className=" shadow-md rounded-full border h-full bg-white/70 backdrop-blur-md aspect-square flex flex-col items-center justify-center"
                    style={{ borderColor: "#39c5bb" }}
                >
                    <span
                        className={`w-8 h-6 bg-no-repeat bg-center rounded-sm border fi-${nationISO.toLocaleLowerCase()}`}
                    />
                    <div className=" text-base drop-shadow-md font-bold dark:text-slate-800">
                        {nationLocale}
                    </div>
                </div>
            </>
        );
    };

    const renderFlag = () => {
        if (confidence <= 0.2 && confidence > 0) {
            return (
                <div className="w-full h-full flex justify-center items-center absolute">
                    <span className="text-9xl">🌏</span>
                </div>
            )
        }


        return (
            <span
                className={` bg-no-repeat bg-center absolute top-0 left-0 fi-${nationISO.toLocaleLowerCase()} ${disable ? "blur-xl" : ""
                    } p-0 h-full w-full ${nationISO !== "CN" ? "blur scale-95" : ""}`}
            >
            </span>
        );
    }

    return (
        <CardWithNoShrink
            containerClass={`overflow-hidden h-full max-h-40 aspect-[4/3] shrink-0 ${className}`}
            containerClassDelete={["p-8"]}
        >
            {loading && (
                <LoadingOverlay
                    visible={loading}
                    loaderProps={{ type: "dots" }}
                />
            )}
            {renderFlag()}
            <div
                className={`h-full w-full items-center justify-center p-4 hidden md:flex`}
            >
                {renderIcon()}
                {!isCN && renderMiddleInfo()}
            </div>
        </CardWithNoShrink>
    );
};

export default UserNation;
