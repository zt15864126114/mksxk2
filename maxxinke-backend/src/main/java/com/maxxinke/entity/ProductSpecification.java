package com.maxxinke.entity;

import lombok.Data;

/**
 * 产品规格实体类
 */
@Data
public class ProductSpecification {
    private String name;    // 规格名称
    private String value;   // 规格值
    private String unit;    // 单位（可选）
} 