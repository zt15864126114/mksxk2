package com.maxxinke.dto;

import lombok.Data;
import javax.validation.constraints.NotBlank;

/**
 * 用户登录数据传输对象
 * 用于用户登录信息的传输
 */
@Data
public class UserLoginDTO {
    
    @NotBlank(message = "用户名不能为空")
    private String username; // 用户名
    
    @NotBlank(message = "密码不能为空")
    private String password; // 密码
} 