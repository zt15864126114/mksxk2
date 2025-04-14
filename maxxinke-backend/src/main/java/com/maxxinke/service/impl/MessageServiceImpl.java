package com.maxxinke.service.impl;

import com.maxxinke.entity.Message;
import com.maxxinke.exception.BusinessException;
import com.maxxinke.repository.MessageRepository;
import com.maxxinke.service.MessageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * 留言服务实现类
 * 实现MessageService接口定义的所有业务方法
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MessageServiceImpl implements MessageService {
    
    private final MessageRepository messageRepository;
    
    /**
     * 创建新留言
     * @param message 留言实体对象
     * @return 创建成功的留言对象
     */
    @Override
    public Message createMessage(Message message) {
        try {
            log.info("创建新留言: {}", message.getContent());
            return messageRepository.save(message);
        } catch (Exception e) {
            log.error("创建留言失败", e);
            throw new BusinessException("创建留言失败");
        }
    }
    
    /**
     * 更新留言信息
     * @param message 留言实体对象
     * @return 更新后的留言对象
     */
    @Override
    public Message updateMessage(Message message) {
        try {
            log.info("更新留言信息, ID: {}", message.getId());
            return messageRepository.save(message);
        } catch (Exception e) {
            log.error("更新留言失败, ID: {}", message.getId(), e);
            throw new BusinessException("更新留言失败");
        }
    }
    
    /**
     * 删除留言
     * @param id 留言ID
     */
    @Override
    public void deleteMessage(Long id) {
        try {
            log.info("删除留言, ID: {}", id);
            messageRepository.deleteById(id);
        } catch (Exception e) {
            log.error("删除留言失败, ID: {}", id, e);
            throw new BusinessException("删除留言失败");
        }
    }
    
    /**
     * 根据ID获取留言
     * @param id 留言ID
     * @return 留言对象
     */
    @Override
    public Message getMessageById(Long id) {
        try {
            log.info("获取留言, ID: {}", id);
            return messageRepository.findById(id)
                .orElseThrow(() -> new BusinessException("留言不存在"));
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("获取留言失败, ID: {}", id, e);
            throw new BusinessException("获取留言失败");
        }
    }
    
    /**
     * 获取所有留言列表
     * @return 留言列表
     */
    @Override
    public List<Message> getAllMessages() {
        try {
            log.info("获取所有留言列表");
            return messageRepository.findAll();
        } catch (Exception e) {
            log.error("获取所有留言列表失败", e);
            throw new BusinessException("获取留言列表失败");
        }
    }
    
    /**
     * 根据状态获取留言列表
     * @param status 留言状态（0-未回复，1-已回复）
     * @return 留言列表
     */
    @Override
    public List<Message> getMessagesByStatus(Integer status) {
        try {
            log.info("根据状态获取留言列表, 状态: {}", status);
            return messageRepository.findByStatus(status, Pageable.unpaged()).getContent();
        } catch (Exception e) {
            log.error("根据状态获取留言列表失败, 状态: {}", status, e);
            throw new BusinessException("获取留言列表失败");
        }
    }
    
    /**
     * 回复留言
     * @param id 留言ID
     * @param reply 回复内容
     * @return 更新后的留言对象
     */
    @Override
    public Message replyMessage(Long id, String reply) {
        try {
            log.info("回复留言, ID: {}", id);
            Message message = getMessageById(id);
            message.setReply(reply);
            message.setStatus(1); // 设置为已回复状态
            return messageRepository.save(message);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("回复留言失败, ID: {}", id, e);
            throw new BusinessException("回复留言失败");
        }
    }

    /**
     * 获取所有留言
     * @return 留言列表
     */
    @Override
    public List<Message> findAll() {
        try {
            log.info("获取所有留言");
            return messageRepository.findAll();
        } catch (Exception e) {
            log.error("获取所有留言失败", e);
            throw new BusinessException("获取留言列表失败");
        }
    }

    /**
     * 根据状态获取留言
     * @param status 留言状态
     * @return 留言列表
     */
    @Override
    public List<Message> findByStatus(Integer status) {
        try {
            log.info("根据状态获取留言, 状态: {}", status);
            return messageRepository.findByStatus(status, Pageable.unpaged()).getContent();
        } catch (Exception e) {
            log.error("根据状态获取留言失败, 状态: {}", status, e);
            throw new BusinessException("获取留言列表失败");
        }
    }

    @Override
    public Page<Message> findByStatus(Integer status, Pageable pageable) {
        try {
            log.info("分页获取留言, 状态: {}, 页码: {}, 大小: {}", status, 
                pageable.getPageNumber(), pageable.getPageSize());
            return messageRepository.findByStatus(status, pageable);
        } catch (Exception e) {
            log.error("分页获取留言失败, 状态: {}", status, e);
            throw new BusinessException("获取留言列表失败");
        }
    }

    @Override
    public Page<Message> findAll(Pageable pageable) {
        try {
            log.info("分页获取所有留言, 页码: {}, 大小: {}", 
                pageable.getPageNumber(), pageable.getPageSize());
            return messageRepository.findAll(pageable);
        } catch (Exception e) {
            log.error("分页获取所有留言失败", e);
            throw new BusinessException("获取留言列表失败");
        }
    }

    @Override
    public List<Message> findByUserId(Long userId) {
        try {
            log.info("获取用户留言, 用户ID: {}", userId);
            return messageRepository.findByUserId(userId);
        } catch (Exception e) {
            log.error("获取用户留言失败, 用户ID: {}", userId, e);
            throw new BusinessException("获取用户留言失败");
        }
    }

    @Override
    public Message updateStatus(Long id, String status) {
        Message message = getMessageById(id);
        try {
            Integer statusValue = Integer.parseInt(status);
            message.setStatus(statusValue);
        } catch (NumberFormatException e) {
            // 如果无法解析为整数，默认设置为已读(1)
            message.setStatus(1);
        }
        return messageRepository.save(message);
    }

    @Override
    public void markAllAsRead() {
        // 查找所有未读消息
        List<Message> unreadMessages = messageRepository.findByStatus(0);
        
        // 将所有未读消息标记为已读
        for (Message message : unreadMessages) {
            message.setStatus(1);
            messageRepository.save(message);
        }
    }
}