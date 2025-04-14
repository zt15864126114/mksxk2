package com.maxxinke.service;

import com.maxxinke.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

/**
 * 留言服务接口
 * 定义留言相关的业务操作，包括留言的CRUD操作和回复功能
 */
public interface MessageService {
    
    /**
     * 创建新留言
     * @param message 留言实体对象
     * @return 创建成功的留言对象
     */
    Message createMessage(Message message);
    
    /**
     * 更新留言信息
     * @param message 留言实体对象
     * @return 更新后的留言对象
     */
    Message updateMessage(Message message);
    
    /**
     * 删除留言
     * @param id 留言ID
     */
    void deleteMessage(Long id);
    
    /**
     * 根据ID获取留言
     * @param id 留言ID
     * @return 留言对象
     */
    Message getMessageById(Long id);
    
    /**
     * 获取所有留言列表
     * @return 留言列表
     */
    List<Message> getAllMessages();
    
    /**
     * 根据状态获取留言列表
     * @param status 留言状态（0-未回复，1-已回复）
     * @return 留言列表
     */
    List<Message> getMessagesByStatus(Integer status);
    
    /**
     * 回复留言
     * @param id 留言ID
     * @param reply 回复内容
     * @return 更新后的留言对象
     */
    Message replyMessage(Long id, String reply);
    
    /**
     * 获取所有留言
     * @return 留言列表
     */
    List<Message> findAll();
    
    /**
     * 根据状态获取留言
     * @param status 留言状态
     * @return 留言列表
     */
    List<Message> findByStatus(Integer status);
    
    /**
     * 获取所有留言
     * @return 留言列表
     */
    Page<Message> findAll(Pageable pageable);
    
    /**
     * 根据状态获取留言
     * @param status 留言状态
     * @return 留言列表
     */
    Page<Message> findByStatus(Integer status, Pageable pageable);

    /**
     * 获取指定用户的留言列表
     * @param userId 用户ID
     * @return 留言列表
     */
    List<Message> findByUserId(Long userId);

    /**
     * 更新消息状态
     * @param id 消息ID
     * @param status 状态值
     * @return 更新后的消息对象
     */
    Message updateStatus(Long id, String status);

    /**
     * 将所有未读消息标记为已读
     */
    void markAllAsRead();
} 