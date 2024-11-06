import { SingleUserScoreRes } from '~/api/backend/typings/beRes';
import { interpolateColorsOfScore } from './chore';
import { rankIt } from '~/components/ranking/card';

export const getSvgCard = (score: SingleUserScoreRes['data'], login: string): string => {
    const { name, userScore, reposScore, prsScore, issuesScore, totalScore } = score;
    const { r, g, b } = interpolateColorsOfScore(totalScore);
    /**
     * 条形图的 y 和 height 需满足 y + height = 314
     * Text y1 与 条形图 y2 的关系是 y2 - y1 = 9
     * 条形图 y 最小不能小于 160，最大不能超过 314
     *
     * 这里的 6.16 为 (314 - 160) / 最高分数
     */
    const maxD = (314 - 160) / 30;
    const base_h = userScore * maxD,
        base_y = 314 - base_h;
    const repo_h = reposScore * maxD,
        repo_y = 314 - repo_h;
    const pr_h = prsScore * maxD,
        pr_y = 314 - pr_h;
    const issue_h = issuesScore * maxD,
        issue_y = 314 - issue_h;
    return `
    <svg width="1004" height="373" xmlns="http://www.w3.org/2000/svg" fill="none">
    <defs>
        <clipPath id="clip0_187_281">
            <rect width="497" height="73" fill="white" y="35.5" x="50" id="svg_1" />
        </clipPath>
    </defs>
    <g>
        <rect x="0.5" y="0.5" width="1003" height="372" rx="23.5" fill="white" id="bg" />
        <rect x="0.5" y="0.5" width="1003" height="372" rx="23.5" stroke="#C7C7C7" id="svg_3" />
        <g clip-path="url(#clip0_187_281)" id="svg_4">
            <text fill="black" xml:space="preserve" font-family="Inter" font-size="32" font-weight="600"
                letter-spacing="0em" id="name">
                <tspan x="50" y="66.6364" id="svg_6">${name ?? login}</tspan>
            </text>
            <text fill="black" fill-opacity="0.66" xml:space="preserve" font-family="Inter" font-size="20"
                letter-spacing="0em" id="login" visible=${name ? '"visible"' : '"hidden"'}>
                <tspan x="50" y="103.773" id="svg_8">${login}</tspan>
            </text>
        </g>
        <text fill="rgb(${r},${g},${b})" xml:space="preserve" font-family="Inter" font-size="64" letter-spacing="0em" id="ranking">
            <tspan x="846" y="95.2727" id="svg_10">${rankIt(totalScore)}</tspan>
        </text>
        <text fill="rgb(${r},${g},${b})" xml:space="preserve" font-family="Inter" font-size="24" letter-spacing="0em" id="score">
            <tspan x="890" y="56.7273" id="svg_12">${totalScore}</tspan>
        </text>
        <text fill="black" xml:space="preserve" font-family="Inter" font-size="55" font-weight="bold"
            letter-spacing="0em" id="bg_score">
            <tspan x="127" y="253.5" id="svg_17">${totalScore} <tspan id="svg_15" font-size="24" letter-spacing="0em" font-weight="400">/100</tspan></tspan>
        </text>
        <text fill="#8C8C8C" xml:space="preserve" font-family="Inter" font-size="8" letter-spacing="0em"
            id="base_title">
            <tspan x="570" y="323.909" id="svg_23">BASE</tspan>
        </text>
        <text fill="#8C8C8C" xml:space="preserve" font-family="Inter" font-size="8" letter-spacing="0em"
            id="repo_title">
            <tspan x="653" y="323.909" id="svg_25">REPO</tspan>
        </text>
        <text fill="#8C8C8C" xml:space="preserve" font-family="Inter" font-size="8" letter-spacing="0em" id="pr_title">
            <tspan x="741" y="323.909" id="svg_27">PR</tspan>
        </text>
        <text fill="#8C8C8C" xml:space="preserve" font-family="Inter" font-size="8" letter-spacing="0em"
            id="issue_title">
            <tspan x="818" y="325.909" id="svg_29">ISSUE</tspan>
        </text>
        <line x1="531" y1="313.75" x2="875" y2="313.75" stroke="#8C8C8C" stroke-width="0.5" stroke-dasharray="1 1"
            id="svg_39" />
        <g id="base">
            <rect x="547" y="${base_y}" width="67" height="${base_h}" fill="#1E90FF" id="svg_19" />
            <text fill="#8C8C8C" xml:space="preserve" font-family="Inter" font-size="11" letter-spacing="0em"
                id="svg_20">
                <tspan x="547" y="${base_y - 9}" id="svg_21">${userScore}</tspan>
            </text>
        </g>
        <g id="repo">
            <rect x="630" y="${repo_y}" width="67" height="${repo_h}" fill="#2ED573" stroke="null" />
            <text fill="#8C8C8C" xml:space="preserve" font-family="Inter" font-size="11" letter-spacing="0em"
                id="svg_31" stroke="null">
                <tspan x="630" y="${repo_y - 9}" id="svg_32" stroke="null">${reposScore}</tspan>
            </text>
        </g>
        <g id="pr">
            <rect x="713" y="${pr_y}" width="67" height="${pr_h}" fill="#FFA502" id="svg_33" />
            <text fill="#8C8C8C" xml:space="preserve" font-family="Inter" font-size="11" letter-spacing="0em"
                id="svg_34">
                <tspan x="713" y="${pr_y - 9}" id="svg_35">${prsScore}</tspan>
            </text>
        </g>
        <g id="issue">
            <rect x="796" y="${issue_y}" width="67" height="${issue_h}" fill="#FF4757" id="svg_36" />
            <text fill="#8C8C8C" xml:space="preserve" font-family="Inter" font-size="11" letter-spacing="0em"
                id="svg_37">
                <tspan x="796" y="${issue_y - 9}" id="svg_38">${issuesScore}</tspan>
            </text>
        </g>
    </g>
</svg>`;
};
