package com.maxxinke.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 访问日志实体类
 * 用于记录网站的访问信息，包括访问路径、IP地址、浏览器信息等
 * 对应数据库中的visit_logs表
 */
@Data
@Entity
@Table(name = "visit_logs")
public class VisitLog {
    
    /**
     * 访问日志ID
     * 自动生成的主键
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /**
     * 访问路径
     * 记录用户访问的URL路径，最大长度50个字符
     */
    @Column(nullable = false)
    private String path;
    
    /**
     * 访问者IP地址
     * 记录访问者的IP地址，最大长度50个字符
     * 支持IPv4和IPv6格式
     */
    @Column
    private String ip;
    
    /**
     * 浏览器信息
     * 记录访问者的User-Agent信息，最大长度200个字符
     * 包含浏览器类型、版本、操作系统等信息
     */
    @Column
    private String userAgent;
    
    /**
     * 访问时间
     * 记录访问发生的具体时间
     * 创建时自动设置，不可更新
     */
    @Column(nullable = false)
    private LocalDateTime createTime;
    
    /**
     * 实体保存前的回调方法
     * 在保存访问日志之前自动设置创建时间
     */
    @PrePersist
    public void prePersist() {
        if (createTime == null) {
            createTime = LocalDateTime.now();
        }
    }
} 