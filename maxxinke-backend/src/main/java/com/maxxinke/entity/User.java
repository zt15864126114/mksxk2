package com.maxxinke.entity;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户实体类
 * 对应数据库中的users表
 */
@Data
@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 用户ID
    
    @Column(nullable = false, unique = true, length = 50)
    private String username; // 用户名
    
    @Column(nullable = false, length = 100)
    private String password; // 密码（加密后的）
    
    @Column(nullable = false, unique = true, length = 100)
    private String email; // 邮箱
    
    @Column(length = 20)
    private String phone; // 电话
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER; // 用户角色
    
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime; // 创建时间
    
    @Column(name = "update_time", nullable = false)
    private LocalDateTime updateTime; // 更新时间
    
    /**
     * 实体保存前的回调方法
     * 设置创建时间和更新时间
     */
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
    }
    
    /**
     * 实体更新前的回调方法
     * 更新修改时间
     */
    @PreUpdate
    protected void onUpdate() {
        updateTime = LocalDateTime.now();
    }
} 