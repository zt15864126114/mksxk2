package com.maxxinke.entity;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 留言实体类
 * 对应数据库中的messages表
 */
@Data
@Entity
@Table(name = "messages")
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 留言ID
    
    @Column(name = "user_id")
    private Long userId; // 用户ID
    
    @Column(nullable = false, length = 50)
    private String name; // 留言人姓名
    
    @Column(nullable = false, length = 100)
    private String email; // 留言人邮箱
    
    @Column(nullable = false, length = 20)
    private String phone; // 留言人电话
    
    @Column(nullable = false, length = 500)
    private String content; // 留言内容
    
    @Column(length = 1000)
    private String reply; // 回复内容
    
    @Column(nullable = false)
    private Integer status = 0; // 状态：0-未回复，1-已回复
    
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