package com.maxxinke.dto;

import com.maxxinke.entity.ArticleStatus;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 文章数据传输对象
 * 用于文章信息的传输
 */
@Data
public class ArticleDTO {
    
    private Long id; // 文章ID
    
    private String title; // 标题
    
    private String content; // 内容
    
    private String summary; // 摘要
    
    private String coverImage; // 封面图片
    
    private ArticleStatus status; // 状态
    
    private Long authorId; // 作者ID
    
    private String authorName; // 作者名称
    
    private LocalDateTime createTime; // 创建时间
    
    private LocalDateTime updateTime; // 更新时间
} 