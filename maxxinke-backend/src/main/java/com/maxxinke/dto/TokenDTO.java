package com.maxxinke.dto;

import lombok.Data;

/**
 * JWT令牌数据传输对象
 * 用于JWT令牌的传输
 */
@Data
public class TokenDTO {
    
    private String token; // JWT令牌
    
    private String type = "Bearer"; // 令牌类型
    
    private Long expiresIn; // 过期时间（秒）
} 