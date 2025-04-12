package com.maxxinke;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class UpdateAdminPassword {
    public static void main(String[] args) {
        // 使用与SecurityConfig相同的设置
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
        String encodedPassword = encoder.encode("123456");
        System.out.println("加密后的密码: " + encodedPassword);
        
        // 输出更新密码的SQL语句
        System.out.println("\n请执行以下SQL语句更新密码：");
        System.out.println("UPDATE admins SET password = '" + encodedPassword + "' WHERE username = 'admin';");
    }
} 