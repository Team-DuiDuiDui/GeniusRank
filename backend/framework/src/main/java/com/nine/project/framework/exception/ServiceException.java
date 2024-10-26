package com.nine.project.framework.exception;

import com.nine.project.framework.errorcode.BaseErrorCode;
import com.nine.project.framework.errorcode.IErrorCode;

import java.util.Optional;

/**
 * 服务端异常
 */
public class ServiceException extends AbstractException {

    public ServiceException(IErrorCode errorCode) {
        this(null, null, errorCode);
    }

    public ServiceException(String message) {
        this(message, null, BaseErrorCode.SERVER_ERROR);
    }

    public ServiceException(String message, Throwable throwable, IErrorCode errorCode) {
        super(message, throwable, errorCode);
    }

    @Override
    public String toString() {
        return "ServiceException{" +
                "code='" + errorCode + "'," +
                "message='" + errorMessage + "'" +
                '}';
    }
}