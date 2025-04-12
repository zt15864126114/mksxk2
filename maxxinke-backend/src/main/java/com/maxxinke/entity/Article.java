package com.maxxinke.entity;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 文章实体类
 * 对应数据库中的articles表
 */
@Data
@Entity
@Table(name = "articles")
public class Article {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 文章ID
    
    @Column(nullable = false, length = 200)
    private String title; // 文章标题
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // 文章内容
    
    @Column(length = 500)
    private String summary; // 文章摘要
    
    @Column(length = 200)
    private String coverImage; // 封面图片URL
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ArticleStatus status = ArticleStatus.DRAFT; // 文章状态
    
    @Column(name = "author_id", nullable = false)
    private Long authorId; // 作者ID
    
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