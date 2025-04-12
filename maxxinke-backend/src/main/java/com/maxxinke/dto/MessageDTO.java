package com.maxxinke.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 留言数据传输对象
 * 用于留言信息的传输
 */
@Data
public class MessageDTO {
    
    private Long id; // 留言ID
    
    private String name; // 留言人姓名
    
    private String email; // 留言人邮箱
    
    private String phone; // 留言人电话
    
    private String content; // 留言内容
    
    private String reply; // 回复内容
    
    private Integer status; // 状态：0-未回复，1-已回复
    
    private LocalDateTime createTime; // 创建时间
    
    private LocalDateTime updateTime; // 更新时间
} 