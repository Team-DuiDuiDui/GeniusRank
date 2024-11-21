import { Avatar } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { InfoIcon } from "../../infoLink";
import {
    EnvironmentOutlined,
    ShopOutlined,
    XOutlined,
} from "@ant-design/icons";
import CardWithNoShrink from "../../constant/cardWithNoShrink";
import { UserDetail } from "~/api/github/graphql/typings/user";

interface userInfo {
    data: UserDetail;
    children?: React.ReactNode;
}

const UserInfoDetail: React.FC<userInfo> = ({ children, data }) => {
    const { t } = useTranslation();
    return (
        <CardWithNoShrink containerClass="flex-shrink h-full w-full">
            <div className="flex flex-row items-center justify-left gap-8 w-full h-full">
                <div className="flex flex-col items-center justify-center">
                    <Avatar
                        src={data.avatarUrl}
                        className="flex-shrink-0 rounded-full"
                        style={{ width: "6rem", height: "6rem" }}
                    />
                    <div className="block md:hidden">
                        {children}
                    </div>
                </div>
                <div className="flex flex-col h-full justify-between">
                    <div className="flex flex-col gap-0.25">
                        {/* data.login 是用户名，data.name 是用户昵称(可选) */}
                        <h2 className="text-2xl font-bold">
                            <a
                                href={`https://github.com/${data.login}`}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-transparent hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-white/20 transition-all px-1 rounded-md"
                            >
                                {data.name ?? data.login}
                            </a>
                        </h2>
                        {data.name && (
                            <p className="text-sm text-gray-500 dark:text-gray-300 px-1">
                                {data.login}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-0.5 px-1">
                        <p>
                            {data.bio ?? (
                                <span className="text-gray-500 dark:text-gray-300">
                                    {t("user.no_description")}
                                </span>
                            )}
                        </p>
                        <p className="text-sm">
                            {data.followers.totalCount} {t("user.followers")} ·
                            {" "}
                            {data.following.totalCount} {t("user.following")}
                        </p>
                    </div>
                </div>
                <div className="ml-auto flex flex-col">
                    {data.location && (
                        <InfoIcon icon={<EnvironmentOutlined />}>
                            {data.location
                                .replaceAll("Taiwan", "Taiwan, China")
                                .replaceAll("taiwan", "Taiwan, China")
                                .replaceAll("台灣", "中国台湾")
                                .replaceAll("臺灣", "中国台湾")}
                        </InfoIcon>
                    )}
                    {data.company && (
                        <InfoIcon
                            href={data.company.startsWith("@")
                                ? `https://github.com/${
                                    data.company.split("@")[1]
                                }`
                                : undefined}
                            icon={<ShopOutlined />}
                        >
                            {data.company}
                        </InfoIcon>
                    )}
                    {data.twitterUsername && (
                        <InfoIcon
                            icon={<XOutlined />}
                            href={`https://twitter.com/${data.twitterUsername}`}
                        >
                            {data.twitterUsername}
                        </InfoIcon>
                    )}
                </div>
            </div>
        </CardWithNoShrink>
    );
};

export default UserInfoDetail;
