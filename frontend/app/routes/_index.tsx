import { Button } from '@mantine/core';
import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/cloudflare';
import { Link, useLoaderData } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
// import { createInstanceForBe } from '~/api/backend/instance';
// import { getRankings } from '~/api/backend/ranking';
import LoadingLayout from '~/components/loading';
// import { user } from '~/cookie';
import i18nServer from '~/modules/i18n.server';
import { RankResp } from '~/api/backend/typings/beRes';
import { useEffect } from 'react';
import { UserCardFull } from '~/components/ranking/card';
import { cacheHeader } from '~/utils/cacheHeader';
export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [{ title: data?.title }, {
        name: "description",
        content: data?.description,
    }];
};

export async function loader({ request, context: _context }: LoaderFunctionArgs) {
    const t = await i18nServer.getFixedT(request);
    // const cookieHeader = request.headers.get('Cookie');
    // const userCookie = (await user.parse(cookieHeader)) || {};
    // const beInstance = createInstanceForBe(context.cloudflare.env.BASE_URL, userCookie.be_token);
    // console.log(Date.now());
    // try {
    //     const rankingData = await getRankings(beInstance, null, null, 21);
    //     return json({ title: t('title'), description: t('user.description'), rankingData }, cacheHeader(300, 86400));
    // } catch {
    return json(
        { title: t('title'), description: t('user.description'), rankingData: fallBackData },
        cacheHeader(300, 86400)
    );
    // }
}

export default function Index() {
    const { t } = useTranslation();
    const data = useLoaderData<typeof loader>();
    const rankingData: RankResp[] = JSON.parse(
        JSON.stringify(data.rankingData.resp),
    );
    const rankingDataList: RankResp[][] = [];
    const length = rankingData.length;
    for (let i = 0; i < length; i += length / 3) {
        const data = rankingData.slice(i, i + length / 3);
        rankingDataList.push([...data, ...data]);
    }
    useEffect(() => {
        const scrollContentLine1 = Array.from(
            document.querySelectorAll(".scrollLineO"),
        );
        const scrollContentLine2 = Array.from(
            document.querySelectorAll(".scrollLineI"),
        );
        const scrollContent = [...scrollContentLine1, ...scrollContentLine2];

        const listener = () => {
            if (document.visibilityState === "visible") {
                scrollContent.forEach((
                    element,
                ) => ((element as HTMLElement).style.animationPlayState =
                    "running")
                );
            } else {
                scrollContent.forEach((
                    element,
                ) => ((element as HTMLElement).style.animationPlayState =
                    "paused")
                );
            }
        };

        document.addEventListener("visibilitychange", listener, false);
        return () => {
            document.removeEventListener("visibilitychange", listener, false);
        };
    }, []);

    return (
        <>
            <div className="px-8 py-12 bg-blue-400/70 text-white flex flex-col justify-center items-center gap-2 relative">
                <LoadingLayout />
                <h1 className="text-6xl font-bold">Genius Rank</h1>
                <h2 className="text-2xl">{t("description")}</h2>
                <div className="flex flex-row gap-7">
                    <Link to="/user">
                        <Button size="md" className="mt-4">
                            {t("lookup_docs")}
                        </Button>
                    </Link>
                    <Link to="/ranking">
                        <Button variant="default" size="md" className="mt-4">
                            {t("see_ranking")}
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-row flex-wrap h-max flex-grow py-20">
                {rankingDataList.slice(0, 15).map((data, lineIndex) => (
                    <div
                        key={lineIndex}
                        className={`flex overflow-auto relative width-auto gap-4 scrollbarHidden`}
                    >
                        {data.map((item, index) => (
                            <UserCardFull
                                key={index}
                                userInfo={item}
                                score={item}
                                style={{
                                    animation: `${
                                        lineIndex % 2
                                            ? "scrollLineO"
                                            : "scrollLineI"
                                    } 60s linear infinite ${
                                        lineIndex % 2 ? "reverse" : ""
                                    }`,
                                }}
                                disabledChevron
                                disabled
                            />
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}

const fallBackData = {
    resp: [
        {
            login: "gaearon",
            name: "dan",
            avatar_url:
                "https://avatars.githubusercontent.com/u/810438?u=9a342ce34340637775698b6391d1c77f1a911f5b&v=4",
            country_iso: "RU",
            totalScore: 94.74,
            userScore: 9,
            reposScore: 49.59,
            prsScore: 28.77,
            issuesScore: 7.38,
        },
        {
            login: "wesbos",
            name: "Wes Bos",
            avatar_url:
                "https://avatars.githubusercontent.com/u/176013?u=1d436e62dc32dbbf1bfefb4d658cd67553154c42&v=4",
            country_iso: "CA",
            totalScore: 93.08,
            userScore: 9,
            reposScore: 49.26,
            prsScore: 27.21,
            issuesScore: 7.61,
        },
        {
            login: "sindresorhus",
            name: "Sindre Sorhus",
            avatar_url:
                "https://avatars.githubusercontent.com/u/170270?u=34acd557a042ac478d273a4621570cadb6b0bd89&v=4",
            country_iso: "NO",
            totalScore: 92.16,
            userScore: 9,
            reposScore: 49.93,
            prsScore: 25.5,
            issuesScore: 7.73,
        },
        {
            login: "JakeWharton",
            name: "Jake Wharton",
            avatar_url: "https://avatars.githubusercontent.com/u/66577?v=4",
            country_iso: "US",
            totalScore: 91.88,
            userScore: 9,
            reposScore: 49.12,
            prsScore: 24.88,
            issuesScore: 8.88,
        },
        {
            login: "yyx990803",
            name: "Evan You",
            avatar_url:
                "https://avatars.githubusercontent.com/u/499550?u=dd9a9ba40daf29be7c310f7075e74251609b03f3&v=4",
            country_iso: "CN",
            totalScore: 91.55,
            userScore: 9,
            reposScore: 45.61,
            prsScore: 27.32,
            issuesScore: 9.62,
        },
        {
            login: "geohot",
            name: "George Hotz",
            avatar_url:
                "https://avatars.githubusercontent.com/u/72895?u=64c16e3f87c708f1f3920331f1f6285f6529960e&v=4",
            country_iso: null,
            totalScore: 91.33,
            userScore: 9,
            reposScore: 43.95,
            prsScore: 28.73,
            issuesScore: 9.65,
        },
        {
            login: "torvalds",
            name: "Linus Torvalds",
            avatar_url: "https://avatars.githubusercontent.com/u/1024025?v=4",
            country_iso: "FI",
            totalScore: 89.85,
            userScore: 9,
            reposScore: 46.38,
            prsScore: 27.24,
            issuesScore: 7.23,
        },
        {
            login: "afc163",
            name: "afc163",
            avatar_url:
                "https://avatars.githubusercontent.com/u/507615?u=63a8ef8e8876c4c1fad07a7737684f5281fedaaa&v=4",
            country_iso: null,
            totalScore: 87.3,
            userScore: 9,
            reposScore: 43.92,
            prsScore: 24.8,
            issuesScore: 9.58,
        },
        {
            login: "ruanyf",
            name: "Ruan YiFeng",
            avatar_url: "https://avatars.githubusercontent.com/u/905434?v=4",
            country_iso: "CN",
            totalScore: 85.41,
            userScore: 9,
            reposScore: 47,
            prsScore: 19.72,
            issuesScore: 9.69,
        },
        {
            login: "karpathy",
            name: "Andrej",
            avatar_url:
                "https://avatars.githubusercontent.com/u/241138?u=05376db54475c3d23b3a409f4c47d14c4855dc28&v=4",
            country_iso: "SK",
            totalScore: 82.43,
            userScore: 25.85,
            reposScore: 42.31,
            prsScore: 11.78,
            issuesScore: 2.49,
        },
        {
            login: "lucidrains",
            name: "Phil Wang",
            avatar_url:
                "https://avatars.githubusercontent.com/u/108653?u=71a8f2f26b707fd35e8c6dc3fdf906b49f131584&v=4",
            country_iso: "US",
            totalScore: 79.02,
            userScore: 9,
            reposScore: 36.4,
            prsScore: 26.65,
            issuesScore: 6.97,
        },
        {
            login: "ThePrimeagen",
            name: "ThePrimeagen",
            avatar_url:
                "https://avatars.githubusercontent.com/u/4458174?u=f59d4f5b38134faff67b8a231591f1288ba51a8e&v=4",
            country_iso: "US",
            totalScore: 72.36,
            userScore: 9,
            reposScore: 39.41,
            prsScore: 14.89,
            issuesScore: 9.06,
        },
        {
            login: "filipedeschamps",
            name: "Filipe Deschamps",
            avatar_url:
                "https://avatars.githubusercontent.com/u/4248081?u=98a643ad7f90c7950d9311e4b5a762fe77af8ada&v=4",
            country_iso: "BR",
            totalScore: 67.91,
            userScore: 9,
            reposScore: 24.36,
            prsScore: 26.07,
            issuesScore: 8.48,
        },
        {
            login: "tj",
            name: "TJ Holowaychuk",
            avatar_url:
                "https://avatars.githubusercontent.com/u/25254?u=d332bdd6d335df9f08e7cdac0e17143d898ec70d&v=4",
            country_iso: null,
            totalScore: 65.47,
            userScore: 9,
            reposScore: 25,
            prsScore: 23.11,
            issuesScore: 8.36,
        },
        {
            login: "hiteshchoudhary",
            name: "Hitesh Choudhary",
            avatar_url:
                "https://avatars.githubusercontent.com/u/11613311?u=eb5b71a918effbaf14260160d8d7dee7caaffe1f&v=4",
            country_iso: "IN",
            totalScore: 64.88,
            userScore: 9,
            reposScore: 39.04,
            prsScore: 13.69,
            issuesScore: 3.15,
        },
        {
            login: "creeperita09",
            name: null,
            avatar_url:
                "https://avatars.githubusercontent.com/u/97898994?u=4c979c540bfc2edc55d2e2ace827cbb0548763b0&v=4",
            country_iso: "IT",
            totalScore: 56.92,
            userScore: 0.22,
            reposScore: 32.39,
            prsScore: 18.87,
            issuesScore: 5.44,
        },
        {
            login: "michaelliao",
            name: "Crypto Michael",
            avatar_url:
                "https://avatars.githubusercontent.com/u/470058?u=dbf6227607a526980eda6d438a9b8126ac04974b&v=4",
            country_iso: "CN",
            totalScore: 56.85,
            userScore: 9,
            reposScore: 22.58,
            prsScore: 19.2,
            issuesScore: 6.07,
        },
        {
            login: "bradtraversy",
            name: "Brad Traversy",
            avatar_url:
                "https://avatars.githubusercontent.com/u/5550850?u=45352e59e108ddd00ead26981cd6a4a53b151b1d&v=4",
            country_iso: "ZA",
            totalScore: 55.86,
            userScore: 9,
            reposScore: 23.66,
            prsScore: 16.43,
            issuesScore: 6.77,
        },
        {
            login: "llSourcell",
            name: "Siraj Raval",
            avatar_url:
                "https://avatars.githubusercontent.com/u/1279609?u=1047da755ae472448aa713540a6e0c9dd2260fe2&v=4",
            country_iso: "US",
            totalScore: 54.58,
            userScore: 9,
            reposScore: 19.93,
            prsScore: 19.27,
            issuesScore: 6.38,
        },
        {
            login: "IDouble",
            name: "Alp ₿📈🚀🌕",
            avatar_url:
                "https://avatars.githubusercontent.com/u/18186995?u=029908cd796896a311b17f835229cfcb03a03929&v=4",
            country_iso: "CH",
            totalScore: 54.07,
            userScore: 9,
            reposScore: 15.95,
            prsScore: 25.3,
            issuesScore: 3.82,
        },
        {
            login: "peng-zhihui",
            name: "稚晖",
            avatar_url:
                "https://avatars.githubusercontent.com/u/12994887?u=6bfec84cb512892557cfed7fd7c52b0b0f41f95b&v=4",
            country_iso: "CN",
            totalScore: 52.69,
            userScore: 9,
            reposScore: 20.7,
            prsScore: 17.45,
            issuesScore: 5.54,
        },
    ],
    nations: [
        "CN",
        "US",
        "NULL",
        "FI",
        "SK",
        "CH",
        "CZ",
        "ZA",
        "IN",
        "BR",
        "RU",
        "NO",
        "JP",
        "IT",
        "CA",
        "AT",
        "\nUS\n",
    ],
    types: [
        "TypeScript",
        "Python",
        "Go",
        "JavaScript",
        "C++",
        "HTML",
        "Java",
        "C",
        "CSS",
        "Vue",
        "Shell",
        "Jupyter Notebook",
        "PHP",
        "Ruby",
        "Latte",
        "TeX",
        "Swift",
        "Rust",
        "Lua",
        "Kotlin",
    ],
    totalCount: 38,
};
