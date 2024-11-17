package com.nine.project.analyze.toolkit;

import com.nine.project.analyze.dto.req.GithubDetailedScoreReqDTO;
import com.nine.project.analyze.dto.req.GithubUserScoreReqDTO;
import org.jetbrains.annotations.NotNull;

import java.util.*;

public class LanguageFrequencyCounter {

    /**
     * 获取使用最多的三种语言
     * @param repos 仓库
     * @return 使用最多的三种语言
     */
    public static List<String> getTopThreeLanguages(List<GithubUserScoreReqDTO.repo> repos) {
        if (repos == null || repos.isEmpty()) {
            return Collections.emptyList();
        }

        // 使用HashMap来统计每种语言的出现次数
        List<Map.Entry<String, Integer>> sortedLanguages = getSortedLanguages(repos);
        return getThreeLanguage(sortedLanguages);
    }

    /**
     * 获取排序后的语言列表
     * @param repos 仓库
     * @return 排序后的语言列表
     */
    private static @NotNull List<Map.Entry<String, Integer>> getSortedLanguages(List<GithubUserScoreReqDTO.repo> repos) {
        Map<String, Integer> languageFrequency = new HashMap<>();

        // 遍历repos列表，统计每种语言的出现次数
        for (GithubUserScoreReqDTO.repo repo : repos) {
            String language = repo.getLanguage();
            if (language != null) {
                languageFrequency.put(language, languageFrequency.getOrDefault(language, 0) + 1);
            }
        }

        // 将语言按出现次数降序排序
        return new ArrayList<>(languageFrequency.entrySet());
    }

    /**
     * 获取使用最多的三种语言
     * @param repos 仓库
     * @return 使用最多的三种语言
     */
    public static List<String> getDetailedTopThreeLanguages(List<GithubDetailedScoreReqDTO.Repository> repos) {
        if (repos == null || repos.isEmpty()) {
            return Collections.emptyList();
        }

        // 使用HashMap来统计每种语言的出现次数
        List<Map.Entry<String, Integer>> sortedLanguages = getDetailedSortedLanguages(repos);
        return getThreeLanguage(sortedLanguages);
    }

    /**
     * 获取排序后的语言列表
     * @param repos 仓库
     * @return 排序后的语言列表
     */
    private static @NotNull List<Map.Entry<String, Integer>> getDetailedSortedLanguages(List<GithubDetailedScoreReqDTO.Repository> repos) {
        Map<String, Integer> languageFrequency = new HashMap<>();

        // 遍历repos列表，统计每种语言的出现次数
        for (GithubDetailedScoreReqDTO.Repository repo : repos) {
            if (repo.getPrimaryLanguage() != null){
                String language = repo.getPrimaryLanguage().getName();
                if (language != null)  languageFrequency.put(language, languageFrequency.getOrDefault(language, 0) + 1);
            }
        }

        // 将语言按出现次数降序排序
        return new ArrayList<>(languageFrequency.entrySet());
    }

    /**
     * 提取使用最多的三种语言
     * @param sortedLanguages 排序后的语言列表
     * @return 使用最多的三种语言
     */
    private static @NotNull List<String> getThreeLanguage(List<Map.Entry<String, Integer>> sortedLanguages) {
        sortedLanguages.sort(Map.Entry.comparingByValue(Comparator.reverseOrder()));

        // 提取使用最多的三种语言
        List<String> topThreeLanguages = new ArrayList<>();
        for (Map.Entry<String, Integer> entry : sortedLanguages) {
            topThreeLanguages.add(entry.getKey());
            if (topThreeLanguages.size() == 3) {
                break;
            }
        }

        return topThreeLanguages;
    }
}
