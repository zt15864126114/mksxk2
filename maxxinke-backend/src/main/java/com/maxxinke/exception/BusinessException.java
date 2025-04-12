package com.maxxinke.exception;

import org.springframework.http.HttpStatus;

/**
 * 业务逻辑异常
 * 当业务逻辑出现问题时抛出
 */
public class BusinessException extends RuntimeException {
    private final HttpStatus status;

    /**
     * 构造函数
     * 
     * @param message 异常信息
     */
    public BusinessException(String message) {
        super(message);
        this.status = HttpStatus.BAD_REQUEST;
    }
    
    /**
     * 构造函数
     * 
     * @param message 异常信息
     * @param status 状态码
     */
    public BusinessException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    // 预定义的业务异常
    public static BusinessException productNotFound() {
        return new BusinessException("产品不存在");
    }

    public static BusinessException invalidFileType() {
        return new BusinessException("不支持的文件类型");
    }

    public static BusinessException fileTooLarge() {
        return new BusinessException("文件大小超过限制");
    }

    public static BusinessException uploadFailed() {
        return new BusinessException("文件上传失败");
    }

    public static BusinessException invalidParameter(String paramName) {
        return new BusinessException("无效的参数: " + paramName);
    }

    public static BusinessException unauthorized() {
        return new BusinessException("未经授权的访问", HttpStatus.UNAUTHORIZED);
    }

    public static BusinessException forbidden() {
        return new BusinessException("没有操作权限", HttpStatus.FORBIDDEN);
    }
} 