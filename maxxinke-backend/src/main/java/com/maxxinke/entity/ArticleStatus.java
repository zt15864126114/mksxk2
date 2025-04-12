package com.maxxinke.entity;

/**
 * 文章状态枚举
 * 定义文章的状态类型
 */
public enum ArticleStatus {
    
    /**
     * 草稿状态
     * 文章未发布，仅作者可见
     */
    DRAFT,
    
    /**
     * 已发布状态
     * 文章已发布，所有用户可见
     */
    PUBLISHED
} 