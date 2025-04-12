package com.maxxinke.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 产品数据传输对象
 * 用于产品信息的传输
 */
@Data
public class ProductDTO {
    
    private Long id; // 产品ID
    
    private String name; // 产品名称
    
    private String category; // 产品类别
    
    private String description; // 产品描述
    
    private String specification; // 产品规格
    
    private String application; // 应用场景
    
    private String image; // 产品图片
    
    private Integer sort; // 排序
    
    private Integer status; // 状态：0-下架，1-上架
    
    private LocalDateTime createTime; // 创建时间
    
    private LocalDateTime updateTime; // 更新时间
} 