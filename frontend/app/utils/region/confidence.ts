import { NationData } from "~/api/backend/region";

export const updateDynamicConfidenceWithDecay = (beData: NationData, newData: NationData): NationData => {
    if (!beData.nationISO || !beData.confidence) return newData;

    const maxConfidence = 0.99;
    const minConfidence = 0.5;
    const alpha = 0.05; // 时间衰减系数（增加用）
    const beta = 0.01; // 时间衰减系数（减少用）
    const gammaIncrease = 0.3; // 增加置信度的强度
    const gammaDecay = 0.2; // 减少置信度的强度

    // 时间差（秒）
    const deltaTime = (newData.time - beData.time) / 1000;

    // 计算时间衰减权重（用于增加）
    const timeWeightIncrease = Math.exp(-alpha * deltaTime);

    // 计算时间衰减权重（用于减少）
    const timeWeightDecay = Math.exp(-beta * deltaTime);

    // 动态置信度增加公式
    function calculateIncreasedConfidence(prior: number, observation: number, timeWeight: number) {
        return prior + gammaIncrease * (observation - prior) * timeWeight;
    }

    // 动态置信度减少公式
    function calculateDecayedConfidence(prior: number, timeWeight: number) {
        return prior * (1 - gammaDecay * timeWeight);
    }

    console.log("beData", beData);
    console.log("newData", newData);

    // 处理 nationISO 不同的情况
    if (beData.nationISO !== newData.nationISO) {
        // 如果置信度较高，动态衰减置信度
        if (beData.confidence > minConfidence) {
            const decayedConfidence = calculateDecayedConfidence(
                beData.confidence,
                timeWeightDecay
            );
            console.log("后端数据不够烂");
            return { ...beData, confidence: Math.max(decayedConfidence, minConfidence) };
        }
        // 如果置信度较低，直接更新为新数据
        console.log("新数据更好");
        return newData;
    }

    // 如果 nationISO 相同，动态增加置信度
    const increasedConfidence = calculateIncreasedConfidence(
        beData.confidence,
        newData.confidence,
        timeWeightIncrease
    );
    console.log("都挺好");

    // 确保置信度在 [minConfidence, maxConfidence] 范围内
    return {
        ...beData,
        confidence: Math.min(increasedConfidence, maxConfidence),
        time: newData.time,
    };
}