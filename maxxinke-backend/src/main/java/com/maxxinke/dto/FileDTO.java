package com.maxxinke.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 文件数据传输对象
 * 用于文件信息的传输
 */
@Data
public class FileDTO {
    
    private Long id; // 文件ID
    
    private String filename; // 文件名
    
    private String originalFilename; // 原始文件名
    
    private String contentType; // 文件类型
    
    private Long size; // 文件大小
    
    private String url; // 文件URL
    
    private Long userId; // 上传用户ID
    
    private String userName; // 上传用户名
    
    private LocalDateTime createTime; // 创建时间
    
    private LocalDateTime updateTime; // 更新时间
} 