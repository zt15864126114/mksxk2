package com.maxxinke.entity;

import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 关于我们实体类
 * 用于存储公司的基本信息，包括公司简介、核心优势、产品优势和应用领域等
 */
@Data
@Entity
@Table(name = "about_us")
public class AboutUs {
    /**
     * 主键ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 公司简介
     * 存储公司的详细介绍和背景信息
     */
    @Column(name = "company_intro", columnDefinition = "TEXT")
    private String companyIntro;

    /**
     * 核心优势
     * 描述公司的核心竞争力和主要优势
     */
    @Column(name = "core_advantages", columnDefinition = "TEXT")
    private String coreAdvantages;

    /**
     * 产品优势
     * 描述公司产品的主要特点和优势
     */
    @Column(name = "product_advantages", columnDefinition = "TEXT")
    private String productAdvantages;

    /**
     * 应用领域
     * 描述公司产品的主要应用领域和场景
     */
    @Column(name = "application_areas", columnDefinition = "TEXT")
    private String applicationAreas;

    /**
     * 创建时间
     * 记录数据创建的时间戳
     */
    @Column(name = "create_time")
    private LocalDateTime createTime;

    /**
     * 更新时间
     * 记录数据最后更新的时间戳
     */
    @Column(name = "update_time")
    private LocalDateTime updateTime;

    /**
     * 数据创建前的处理
     * 自动设置创建时间和更新时间
     */
    @PrePersist
    protected void onCreate() {
        createTime = LocalDateTime.now();
        updateTime = LocalDateTime.now();
    }

    /**
     * 数据更新前的处理
     * 自动更新修改时间
     */
    @PreUpdate
    protected void onUpdate() {
        updateTime = LocalDateTime.now();
    }
} 