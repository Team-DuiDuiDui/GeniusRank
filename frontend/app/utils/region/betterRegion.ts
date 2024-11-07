function calculateNationPrediction(fansList: Fan[], followersList: Follower[]) {
    const alpha = 0.05; // 时间衰减系数
    const beta = 0.1; // 二层关系的额外衰减系数

    // 计算时间衰减权重
    function calculateTimeWeight(index: number, decay: number) {
        return Math.exp(-decay * index);
    }

    // 计算社交影响力权重
    function calculateSocialInfluenceWeight(count: number) {
        return 1 / (1 + Math.log(1 + count));
    }

    // 获取 nation 权重
    function calculateLocationWeight(location: string | number, locationCounts: { [s: string]: unknown; } | ArrayLike<unknown>) {
        return locationCounts[location] ? locationCounts[location] / Object.values(locationCounts).reduce((a, b) => a + b, 0) : 0;
    }

    // 计算直接粉丝的综合权重
    function calculateDirectWeight(fan: Fan, index: number, locationCounts: any) {
        const timeWeight = calculateTimeWeight(index, alpha);
        const influenceWeight = calculateSocialInfluenceWeight(fan.following);
        const locationWeight = calculateLocationWeight(fan.location, locationCounts);
        return timeWeight * influenceWeight * locationWeight;
    }

    // 计算二层粉丝的权重
    function calculateSecondLayerWeight(fanWeight: number) {
        return fanWeight * Math.exp(-beta);
    }

    // 统计 location 出现次数
    function getLocationCounts(list: any[]) {
        return list.reduce((counts: { [x: string]: any; }, user: { location: string | number; }) => {
            if (user.location) counts[user.location] = (counts[user.location] || 0) + 1;
            return counts;
        }, {});
    }

    // 计算粉丝和关注者的综合权重
    function calculateWeights(list: any[], locationCounts: any, isFollowerList: any) {
        return list.map((user: { followers: any; following: any; location: any; }, index: any) => {
            const timeWeight = calculateTimeWeight(index, isFollowerList ? alpha : alpha);
            const influenceWeight = calculateSocialInfluenceWeight(isFollowerList ? user.followers : user.following);
            const locationWeight = calculateLocationWeight(user.location, locationCounts);
            return timeWeight * influenceWeight * locationWeight;
        });
    }

    // 计算后验概率
    function calculatePosteriorProbabilities(list: any, locationCounts: any, isFollowerList: boolean) {
        const weights = calculateWeights(list, locationCounts, isFollowerList);
        const totalWeight = weights.reduce((sum: any, weight: any) => sum + weight, 0);
        return weights.map((weight: number) => weight / totalWeight);
    }

    // 计算置信度
    function calculateConfidence(probabilities: any[]) {
        const entropy = -probabilities.reduce((sum: number, p: number) => sum + (p > 0 ? p * Math.log(p) : 0), 0);
        return 1 - entropy;
    }

    // 处理粉丝和关注者列表
    function processList(list: any) {
        const locationCounts = getLocationCounts(list);
        const probabilities = calculatePosteriorProbabilities(list, locationCounts, false);
        const confidence = calculateConfidence(probabilities);
        return Object.keys(locationCounts).map((nation, index) => ({
            nation,
            confidence: probabilities[index] * confidence
        }));
    }

    // 获取粉丝和关注者列表的结果
    const fanResults = processList(fansList);
    const followerResults = processList(followersList);

    // 合并两个列表并按置信度降序排序
    const combinedResults: Result[] = ([...fanResults, ...followerResults] as Result[])
        .reduce((acc, curr) => {
            const existing = acc.find(res => res.nation === curr.nation);
            if (existing) {
                existing.confidence += curr.confidence;
            } else {
                acc.push(curr);
            }
            return acc;
        }, [])
        .sort((a, b) => b.confidence - a.confidence);

    return combinedResults;
}

interface Fan {
    location: string;
    followers: number;
    following: number;
}

interface Follower {
    location: string;
    followers: number;
    following: number;
}

interface Result {
    nation: string
    confidence: number
}

// 示例输入数据
const fansList = [
    { location: 'China', followers: 100, following: 50 },
    { location: 'USA', followers: 150, following: 30 },
    { location: 'India', followers: 50, following: 200 },
    // ... 更多粉丝数据
];

const followersList = [
    { location: 'China', followers: 500, following: 10 },
    { location: 'Canada', followers: 200, following: 20 },
    { location: 'India', followers: 70, following: 30 },
    // ... 更多关注者数据
];

// 调用函数并打印结果
const result = calculateNationPrediction(fansList, followersList);
console.log(result);
