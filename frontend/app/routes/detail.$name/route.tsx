import {
    ShouldRevalidateFunction,
    useFetcher,
    useLoaderData,
    useRouteError,
} from "@remix-run/react";
import { MetaFunction } from "@remix-run/cloudflare";
import UserBasic from "~/components/userinfo/basic";
import UserInfoDetail from "~/components/userinfo/detail/info";
import UserIssuesDetail from "~/components/userinfo/detail/issues";
import UserPullRequestsDetail from "~/components/userinfo/detail/prs";
import UserReposContributeDetail from "~/components/userinfo/detail/reposContribute";
import UserReposDetail from "~/components/userinfo/detail/repos";
import { useTranslation } from "react-i18next";
import UserNation from "~/components/userinfo/region";
import UserScoreDetail from "~/components/userinfo/detail/score";
import loader from "./loader";
import action from "./action";
import lazyAction from "~/routes/lazy.$name";
import { useEffect } from "react";
import ErrorHandle from "~/components/errorHandle";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: data?.title ?? "Error | Genius Rank" },
        {
            name: "description",
            content: data?.description,
        },
    ];
};

export { action, loader };

export default function User() {
    const data = useLoaderData<typeof loader>();
    const { t } = useTranslation();
    const { user } = data.data;
    const fetcher = useFetcher<typeof action>();
    const lazyFetcher = useFetcher<typeof lazyAction>();
    const isStillHim = fetcher.data?.login === user.login;

    useEffect(() => {
        if (data.regionParamCopy) {
            if (
                !(data.nationData.time === 0 &&
                    Date.now() / 1000 - data.nationData.time > 86400)
            ) {
                console.log("时间跨度不足以重新判断");
                return;
            }
            const formData = new FormData();
            formData.append("userData", JSON.stringify(data.regionParamCopy));
            formData.append("dataFromBe", JSON.stringify(data.nationData));
            lazyFetcher.submit(
                formData,
                {
                    action: "/lazy/" + user.login,
                    method: "POST",
                },
            );
            console.log("fetcher submit");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const generateNationCard = (className = "hidden md:block") => (
        <UserNation
        data={data}
        fetcher={fetcher}
        userData={{
            followers: user.followers,
            following: user.following,
            login: user.login,
        }}
        nationISO={(isStillHim &&
            fetcher.data?.nationISO) ||
            data.nationData.nationISO}
        nationLocale={t(
            `country.${
                (isStillHim &&
                    fetcher.data?.nationISO) ||
                data.nationData.nationISO
            }`,
        )}
        confidence={(isStillHim &&
            fetcher.data?.confidence) ||
            data.nationData.confidence}
        message={
            <div className="flex flex-col items-center justify-center">
                <span>
                    {(isStillHim &&
                            fetcher.data
                                ?.message) ||
                            data.nationData
                                    .confidence <=
                                0.2
                        ? t("user.info.confidence_low")
                        : t(
                            data.nationData.message,
                        )}
                </span>
                <span>
                    {t("user.confidence")}:{" "}
                    {(isStillHim &&
                            fetcher.data
                                ?.confidence) ||
                            data.nationData
                                    .confidence <=
                                0.2
                        ? NaN
                        : data.nationData
                            .confidence}
                </span>
            </div>
        }
        isStillHim={isStillHim}
        className={className}
    />
    );

    return (
        <>
            <div className="flex items-center justify-center w-full mt-2 z-0">
                <div className="flex flex-row items-center gap-16 w-full h-full justify-center relative">
                    <UserBasic>
                        <div className="md:flex md:gap-4 md:h-40 w-full h-auto items-start md:flex-row whitespace-nowrap flex-col gap-3">
                            <UserInfoDetail data={user}>
                                {generateNationCard("block md:hidden h-8 absolute bottom-0 right-0")}
                            </UserInfoDetail>
                            {generateNationCard()}
                        </div>
                        <UserScoreDetail
                            scores={data.scores}
                            data={user}
                            error={data.scoresError}
                        />
                        <UserReposDetail data={user} />
                        <UserReposContributeDetail data={user} />
                        <UserPullRequestsDetail data={user} />
                        <UserIssuesDetail data={user} />
                    </UserBasic>
                </div>
            </div>
        </>
    );
}

export function ErrorBoundary() {
    const error = useRouteError();
    return <ErrorHandle error={error} isUser />;
}

export const shouldRevalidate: ShouldRevalidateFunction = (
    { actionResult, defaultShouldRevalidate },
) => {
    if (actionResult?.donotLoad) {
        return false;
    }
    return defaultShouldRevalidate;
};
