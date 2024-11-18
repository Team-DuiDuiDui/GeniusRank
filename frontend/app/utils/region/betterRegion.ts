
export interface User {
    location: string | null;
    followers: number;
    followings: number;
}

export function calculateNationPrediction(fansList: User[], followersList?: User[]) {
    // 动态计算时间衰减系数 α
    function calculateAlpha(N: number): number {
        if (N <= 0) {
            return 0.01; // 设置一个默认的最小正数，避免除以零
        }
        return Math.log(2) / (N / 2);
    }

    // 时间衰减权重
    function calculateTimeWeight(index: number, alpha: number): number {
        return Math.exp(-alpha * index);
    }

    // 社交影响力权重，处理异常值
    function calculateSocialInfluenceWeight(count: number, maxCount: number): number {
        const adjustedCount = Math.min(count + 1, maxCount); // 确保 count 为非负数
        return 1 / (1 + Math.log(1 + adjustedCount));
    }

    // 地理位置标准化
    function standardizeLocation(location: string | null): string | null {
        if (!location || location === "NULL" || location === "null") return null;
        // 简化的标准化示例，实际应使用地名库或正则表达式处理
        return location.trim().toUpperCase(); // 使用大写，匹配 globalLocationDistribution 的键
    }

    function calculateInformationContent(priorProb: number): number {
        const minProb = 1e-6; // 防止取对数时出现负无穷
        const adjustedProb = Math.max(priorProb, minProb);
        return -Math.log(adjustedProb);
    }

    // 计算先验概率
    function getPriorProbability(location: string, globalLocationDistribution: Record<string, number>): number {
        return globalLocationDistribution[location] || 0.0001; // 如果没有数据，赋予一个很小的概率
    }

    // 计算后验概率
    function calculatePosteriorProbabilities(
        list: User[],
        isFollowerList: boolean,
        globalLocationDistribution: Record<string, number>
    ): { [location: string]: number } {
        const N = list.length;
        const alpha = calculateAlpha(N);
        const maxCount = 100000; // 设定粉丝或关注数量的最大阈值

        const locationWeights: { [location: string]: number } = {};
        let totalWeight = 0;

        list.forEach((user, index) => {
            const standardizedLocation = standardizeLocation(user.location);

            if (standardizedLocation) {
                const timeWeight = calculateTimeWeight(index, alpha);
                const influenceWeight = calculateSocialInfluenceWeight(
                    isFollowerList ? user.followers : user.followings,
                    maxCount
                );
                const priorProb = getPriorProbability(standardizedLocation, globalLocationDistribution);
                const infoContent = calculateInformationContent(priorProb);
                const weight = timeWeight * influenceWeight * infoContent;

                locationWeights[standardizedLocation] = (locationWeights[standardizedLocation] || 0) + weight;
                totalWeight += weight; // 仅累计有效位置的权重
            }
            // 如果 standardizedLocation 为 null，保留索引，但不参与权重计算
        });

        const posteriorProbabilities: { [location: string]: number } = {};

        if (totalWeight === 0) {
            // 如果总权重为零，给予所有位置一个均等的概率
            const numLocations = Object.keys(globalLocationDistribution).length || 1;
            for (const location in globalLocationDistribution) {
                posteriorProbabilities[location] = 1 / numLocations;
            }
        } else {
            for (const location in locationWeights) {
                posteriorProbabilities[location] = locationWeights[location] / totalWeight;
            }
        }

        return posteriorProbabilities;
    }

    // 计算置信度
    function calculateConfidence(probabilities: { [location: string]: number }): number {
        if (Object.keys(probabilities).length === 1) {
            return 1; // 如果只有一个位置，直接返回 1
        }
        const entropy = -Object.values(probabilities).reduce(
            (sum, p) => {
                if (p > 0 && !isNaN(p)) {
                    return sum + p * Math.log(p);
                } else {
                    return sum;
                }
            },
            0
        );
        const numLocations = Object.keys(probabilities).length || 1;
        const maxEntropy = Math.log(numLocations);

        const normalizedEntropy = entropy / maxEntropy;

        const confidence = 1 - normalizedEntropy;

        // 确保置信度在 [0, 1] 范围内
        return Math.min(Math.max(confidence, 0), 1);
    }

    // 处理粉丝和关注者列表
    function processList(list: User[], isFollowerList: boolean) {
        const probabilities = calculatePosteriorProbabilities(
            list,
            isFollowerList,
            globalLocationDistribution
        );
        console.log("probabilities:", probabilities)
        const confidence = calculateConfidence(probabilities);

        return Object.keys(probabilities).map((location) => ({
            nation: location,
            probability: probabilities[location],
            confidence: probabilities[location] * confidence,
        }));
    }

    // 获取粉丝和关注者列表的结果
    const fanResults = processList(fansList, false);
    const followerResults = followersList ? processList(followersList, true) : [] as { nation: string; probability: number; confidence: number }[];

    // 合并两个列表并按置信度降序排序
    const combinedResults = [...fanResults, ...followerResults].reduce(
        (acc, curr) => {
            const existing = acc.find((res) => res.nation === curr.nation);
            if (existing) {
                existing.probability += curr.probability;
                existing.confidence += curr.confidence;
            } else {
                acc.push(curr);
            }
            return acc;
        },
        [] as { nation: string; probability: number; confidence: number }[]
    );

    // 归一化概率和置信度
    const totalProbability = combinedResults.reduce((sum, res) => sum + res.probability, 0);

    if (totalProbability === 0) {
        const numResults = combinedResults.length || 1;
        combinedResults.forEach((res) => {
            res.probability = 1 / numResults;
        });
    } else {
        combinedResults.forEach((res) => {
            res.probability /= totalProbability;
        });
    }

    combinedResults.sort((a, b) => b.confidence - a.confidence);

    return combinedResults;
}

// 全球地理位置分布，来源于 http://47.121.222.224:30013/#/ 和 github 2021 年的官方报告
const globalLocationDistribution: Record<string, number> = {
    US: 0.25,
    IN: 0.12,
    CN: 0.11,
    BR: 0.05,
    GB: 0.06,
    DE: 0.05,
    CA: 0.04,
    FR: 0.04,
    RU: 0.04,
    ES: 0.03,
    PL: 0.02,
    AU: 0.02,
    UA: 0.02,
    JP: 0.02,
    ID: 0.02,
    AF: 0.001325301204819273,
    AL: 0.0013172690763052167,
    DZ: 0.0013092369477911605,
    AO: 0.0013012048192771045,
    AR: 0.001293172690763048,
    AM: 0.0012851405622489919,
    AT: 0.0012771084337349357,
    AZ: 0.0012690763052208794,
    BH: 0.0012610441767068234,
    BD: 0.001253012048192767,
    BY: 0.001244979919678711,
    BE: 0.0012369477911646548,
    BZ: 0.0012289156626505986,
    BJ: 0.0012208835341365424,
    BT: 0.0012128514056224862,
    BO: 0.00120481927710843,
    BA: 0.0011967871485943737,
    BW: 0.0011887550200803175,
    VG: 0.0011807228915662613,
    BN: 0.0011726907630522053,
    BG: 0.0011646586345381489,
    BF: 0.0011566265060240929,
    BI: 0.0011485943775100366,
    KH: 0.0011405622489959802,
    CM: 0.0011325301204819242,
    CV: 0.0011244979919678678,
    KY: 0.0011164658634538118,
    CF: 0.0011084337349397556,
    TD: 0.0011004016064256994,
    CL: 0.0010923694779116431,
    CO: 0.001084337349397587,
    KM: 0.0010763052208835307,
    CG: 0.0010682730923694745,
    CD: 0.0010602409638554185,
    CR: 0.001052208835341362,
    HR: 0.001044176706827306,
    CY: 0.0010361445783132496,
    CZ: 0.0010281124497991936,
    DK: 0.0010200803212851374,
    DJ: 0.0010120481927710812,
    DO: 0.001004016064257025,
    EC: 0.0009959839357429688,
    EG: 0.0009879518072289126,
    SV: 0.0009799196787148563,
    GQ: 0.0009718875502008,
    ER: 0.0009638554216867439,
    EE: 0.0009558232931726878,
    ET: 0.0009477911646586315,
    FJ: 0.0009397590361445754,
    FI: 0.0009317269076305193,
    GA: 0.0009236947791164629,
    GM: 0.0009156626506024067,
    GE: 0.0009076305220883506,
    GH: 0.0008995983935742943,
    GR: 0.0008915662650602382,
    GL: 0.0008835341365461819,
    GT: 0.0008755020080321258,
    GN: 0.0008674698795180696,
    GY: 0.0008594377510040133,
    HT: 0.0008514056224899572,
    HN: 0.0008433734939759009,
    HK: 0.0008353413654618447,
    HU: 0.0008273092369477886,
    IS: 0.0008192771084337324,
    IR: 0.0008112449799196761,
    IQ: 0.00080321285140562,
    IE: 0.0007951807228915638,
    IM: 0.0007871485943775076,
    IL: 0.0007791164658634514,
    IT: 0.0007710843373493952,
    CI: 0.000763052208835339,
    JM: 0.0007550200803212827,
    JO: 0.0007469879518072265,
    KZ: 0.0007389558232931704,
    KE: 0.0007309236947791142,
    KR: 0.000722891566265058,
    KW: 0.0007148594377510018,
    KG: 0.0007068273092369456,
    LA: 0.0006987951807228893,
    LV: 0.0006907630522088331,
    LB: 0.0006827309236947769,
    LS: 0.0006746987951807208,
    LR: 0.0006666666666666646,
    LY: 0.0006586345381526084,
    LT: 0.0006506024096385523,
    LU: 0.0006425702811244959,
    MO: 0.0006345381526104397,
    MK: 0.0006265060240963835,
    MG: 0.0006184738955823274,
    MW: 0.0006104417670682712,
    MY: 0.000602409638554215,
    MV: 0.0005943775100401588,
    ML: 0.0005863453815261026,
    MT: 0.0005783132530120464,
    MR: 0.0005702811244979901,
    MU: 0.0005622489959839339,
    MX: 0.0005542168674698778,
    MD: 0.0005461847389558216,
    MC: 0.0005381526104417654,
    MN: 0.0005301204819277092,
    ME: 0.000522088353413653,
    MA: 0.0005140562248995968,
    MZ: 0.0005060240963855406,
    MM: 0.0004979919678714844,
    NA: 0.0004899598393574282,
    NP: 0.00048192771084337195,
    NL: 0.00047389558232931574,
    NZ: 0.00046586345381525963,
    NI: 0.00045783132530120336,
    NE: 0.00044979919678714715,
    NG: 0.00044176706827309093,
    KP: 0.0004337349397590348,
    NO: 0.0004257028112449786,
    OM: 0.00041767068273092234,
    PK: 0.0004096385542168662,
    PA: 0.00040160642570281,
    PY: 0.0003935742971887538,
    PE: 0.0003855421686746976,
    PH: 0.00037751004016064137,
    PT: 0.0003694779116465852,
    PR: 0.000361445783132529,
    QA: 0.0003534136546184728,
    RE: 0.00034538152610441656,
    RO: 0.0003373493975903604,
    RW: 0.0003293172690763042,
    SM: 0.00032128514056224797,
    SA: 0.00031325301204819175,
    SN: 0.0003052208835341356,
    RS: 0.0002971887550200794,
    SL: 0.0002891566265060232,
    SG: 0.00028112449799196695,
    SK: 0.0002730923694779108,
    SI: 0.0002650602409638546,
    SO: 0.0002570281124497984,
    ZA: 0.0002489959839357422,
    LK: 0.00024096385542168598,
    SD: 0.00023293172690762982,
    SR: 0.00022489959839357357,
    SZ: 0.0002168674698795174,
    SE: 0.00020883534136546117,
    CH: 0.000200803212851405,
    SY: 0.0001927710843373488,
    TW: 0.0001847389558232926,
    TJ: 0.0001767068273092364,
    TZ: 0.0001686746987951802,
    TH: 0.00016064257028112398,
    TG: 0.0001526104417670678,
    TO: 0.0001445783132530116,
    TT: 0.0001365461847389554,
    TN: 0.0001285140562248992,
    TR: 0.00012048192771084299,
    TM: 0.00011244979919678679,
    VI: 0.00010441767068273058,
    UG: 0.0000963855421686744,
    AE: 0.0000883534136546182,
    UY: 0.00008032128514056199,
    UZ: 0.0000722891566265058,
    VA: 0.0000642570281124496,
    VE: 0.00005622489959839339,
    VN: 0.0000481927710843372,
    YE: 0.000040160642570280996,
    YU: 0.0000321285140562248,
    ZR: 0.0000240963855421686,
    ZM: 0.0000160642570281124,
    ZW: 0.0000080321285140562
}