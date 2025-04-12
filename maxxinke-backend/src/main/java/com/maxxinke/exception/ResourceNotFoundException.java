package com.maxxinke.exception;

/**
 * 资源未找到异常
 * 当请求的资源不存在时抛出
 */
public class ResourceNotFoundException extends RuntimeException {
    
    /**
     * 构造函数
     * 
     * @param message 异常信息
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    /**
     * 构造函数
     * 
     * @param message 异常信息
     * @param cause 原始异常
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
} 