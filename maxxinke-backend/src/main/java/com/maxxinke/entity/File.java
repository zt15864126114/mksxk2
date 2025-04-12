package com.maxxinke.entity;

import javax.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 文件实体类
 * 对应数据库中的files表
 */
@Data
@Entity
@Table(name = "files")
public class File {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 文件ID
    
    @Column(nullable = false, length = 200)
    private String filename; // 文件名
    
    @Column(nullable = false, length = 200)
    private String originalName; // 原始文件名
    
    @Column(nullable = false, length = 500)
    private String url; // 文件URL
    
    @Column(nullable = false)
    private Long size; // 文件大小（字节）
    
    @Column(nullable = false, length = 100)
    private String type; // 文件类型
    
    @Column(name = "user_id", nullable = false)
    private Long userId; // 上传用户ID
    
    @Column(name = "mime_type", length = 200)
    private String mimeType;
    
    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
    
    @Column(name = "create_time", nullable = false)
    private LocalDateTime createTime;
    
    @Column(name = "update_time", nullable = false)
    private LocalDateTime updateTime;
    
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