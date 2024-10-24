package com.nine.project.user.toolkit;

import cn.hutool.core.util.StrUtil;
import com.nine.project.framework.errorcode.BaseErrorCode;
import com.nine.project.user.dto.req.UserRegisterReqDTO;
import com.nine.project.user.dto.req.UserUpdateReqDTO;

import static com.nine.project.framework.errorcode.BaseErrorCode.*;

/**
 * 校验用户参数工具类
 */
public class VerifyUserParamUtil {

    public static BaseErrorCode verifyRegister(UserRegisterReqDTO requestParam) {
        // 校验邮箱
        if (RegexUtil.isEmailInvalid(requestParam.getEmail())) {
            return EMAIL_FORMAT_ERROR;
        }

        // 校验用户名
        if (RegexUtil.isUsernameInvalid(requestParam.getUsername())) {
            return USER_NAME_FORMAT_ERROR;
        }

        // 校验密码
        if (RegexUtil.isPasswordInvalid(requestParam.getPassword())) {
            return PASSWORD_FORMAT_ERROR;
        }

        return null;
    }

    public static BaseErrorCode verifyUpdate(UserUpdateReqDTO requestParam) {
        // 校验用户名
        if (StrUtil.isNotEmpty(requestParam.getUsername()) && RegexUtil.isUsernameInvalid(requestParam.getUsername())) {
            return USER_NAME_FORMAT_ERROR;
        }

        // 校验密码
        if (StrUtil.isNotEmpty(requestParam.getPassword()) && RegexUtil.isPasswordInvalid(requestParam.getPassword())) {
            return PASSWORD_FORMAT_ERROR;
        }

        return null;
    }
}
