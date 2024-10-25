/** 用来模拟被阻滞的情况 */
const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export default sleep;
