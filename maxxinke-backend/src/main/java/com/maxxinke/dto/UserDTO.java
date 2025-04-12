package com.maxxinke.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户数据传输对象
 * 用于用户信息的传输
 */
@Data
public class UserDTO {
    
    private Long id; // 用户ID
    
    private String username; // 用户名
    
    private String email; // 邮箱
    
    private String phone; // 电话
    
    private String avatar; // 头像
    
    private String bio; // 个人简介
    
    private LocalDateTime createTime; // 创建时间
    
    private LocalDateTime updateTime; // 更新时间
} 