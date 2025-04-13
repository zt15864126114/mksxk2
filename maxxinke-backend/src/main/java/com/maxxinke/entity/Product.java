package com.maxxinke.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "product")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String name;
    
    @Column(nullable = false, length = 50)
    private String category;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String specification;
    
    @Column(columnDefinition = "TEXT")
    private String application;
    
    @Column(length = 255)
    private String image;
    
    @Column(nullable = false)
    private Integer sort = 0;
    
    @Column(nullable = false)
    private Integer status = 1;
    
    @Column(nullable = false)
    private Long views = 0L;
    
    @Column(name = "create_time", nullable = false, updatable = false)
    private LocalDateTime createTime;
    
    @Column(name = "update_time", nullable = false)
    private LocalDateTime updateTime;
    
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
        if (views == null) {
            views = 0L;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updateTime = LocalDateTime.now();
    }
} 