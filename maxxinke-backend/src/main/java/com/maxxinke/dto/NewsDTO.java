package com.maxxinke.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 新闻数据传输对象
 * 用于新闻信息的传输
 */
@Data
public class NewsDTO {
    
    private Long id; // 新闻ID
    
    private String title; // 标题
    
    private String content; // 内容
    
    private String image; // 图片
    
    private String type; // 类型
    
    private Integer status; // 状态：0-草稿，1-已发布
    
    private LocalDateTime createTime; // 创建时间
    
    private LocalDateTime updateTime; // 更新时间
} 