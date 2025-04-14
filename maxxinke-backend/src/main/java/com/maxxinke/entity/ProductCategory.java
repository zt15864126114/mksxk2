package com.maxxinke.entity;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 产品类别实体类
 * 对应数据库中的product_categories表
 */
@Data
@Entity
@Table(name = "product_categories")
public class ProductCategory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 类别ID
    
    @Column(nullable = false, length = 100, unique = true)
    private String name; // 类别名称
    
    @Column(nullable = false)
    private Integer sort = 0; // 排序值
    
    @Column(nullable = false)
    private Integer status = 1; // 状态：0-禁用，1-启用
    
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