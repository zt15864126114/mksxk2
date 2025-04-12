package com.maxxinke.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 管理员实体类
 * 对应数据库中的admins表
 */
@Data
@Entity
@Table(name = "admins")
public class Admin {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 管理员ID
    
    @Column(nullable = false, unique = true, length = 50)
    private String username; // 用户名
    
    @Column(nullable = false, length = 255)
    private String password; // 密码（加密后的）
    
    @Column(name = "real_name", length = 50)
    private String realName; // 真实姓名
    
    @Column(nullable = false)
    private Integer status = 1; // 状态：0-禁用，1-正常
    
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