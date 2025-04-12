package com.maxxinke.entity;

/**
 * 用户角色枚举
 * 定义系统中的用户角色类型
 */
public enum Role {
    
    /**
     * 管理员角色
     * 拥有最高权限，可以管理所有内容
     */
    ADMIN,
    
    /**
     * 普通用户角色
     * 拥有基本权限，可以查看和评论内容
     */
    USER
} 