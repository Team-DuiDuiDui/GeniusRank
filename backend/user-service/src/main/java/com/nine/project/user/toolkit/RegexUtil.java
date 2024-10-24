package com.nine.project.user.toolkit;

import cn.hutool.core.util.StrUtil;

/**
 * 正则工具类
 */
public class RegexUtil {
    /**
     * 用户名正则，长度限制2-24，不允许出现特殊字符<br>
     * 允许的字符：字母（大小写）、数字、下划线和短横线
     */
    public static final String USERNAME_REGEX = "^[a-zA-Z0-9_-]{2,24}$";
    /**
     * 密码正则，长度限制6-16
     */
    public static final String PASSWORD_REGEX = "^.{6,16}$";
    /**
     * 手机号正则
     */
    public static final String PHONE_REGEX = "^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\\d{8}$";
    /**
     * 邮箱正则
     */
    public static final String EMAIL_REGEX = "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$";

    /**
     * 是否是无效用户名格式
     *
     * @param username 要校验的用户名
     * @return true:无效，false：有效
     */
    public static boolean isUsernameInvalid(String username) {
        return mismatch(username, USERNAME_REGEX);
    }

    /**
     * 是否是无效密码格式
     *
     * @param password 要校验的密码
     * @return true:无效，false：有效
     */
    public static boolean isPasswordInvalid(String password) {
        return mismatch(password, PASSWORD_REGEX);
    }

    /**
     * 是否是无效手机格式
     *
     * @param phone 要校验的手机号
     * @return true:符合，false：不符合
     */
    public static boolean isPhoneInvalid(String phone) {
        return mismatch(phone, PHONE_REGEX);
    }

    /**
     * 是否是无效邮箱格式
     *
     * @param email 要校验的邮箱
     * @return true:符合，false：不符合
     */
    public static boolean isEmailInvalid(String email) {
        return mismatch(email, EMAIL_REGEX);
    }

    // 校验是否不符合正则格式
    private static boolean mismatch(String str, String regex) {
        if (StrUtil.isBlank(str)) {
            return true;
        }
        return !str.matches(regex);
    }
}
