package com.maxxinke.service.impl;

import com.maxxinke.entity.Message;
import com.maxxinke.repository.MessageRepository;
import com.maxxinke.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
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
public class MessageServiceImpl implements MessageService {
    
    @Autowired
    private MessageRepository messageRepository;
    
    /**
     * 创建新留言
     * @param message 留言实体对象
     * @return 创建成功的留言对象
     */
    @Override
    public Message createMessage(Message message) {
        return messageRepository.save(message);
    }
    
    /**
     * 更新留言信息
     * @param message 留言实体对象
     * @return 更新后的留言对象
     */
    @Override
    public Message updateMessage(Message message) {
        return messageRepository.save(message);
    }
    
    /**
     * 删除留言
     * @param id 留言ID
     */
    @Override
    public void deleteMessage(Long id) {
        messageRepository.deleteById(id);
    }
    
    /**
     * 根据ID获取留言
     * @param id 留言ID
     * @return 留言对象
     */
    @Override
    public Message getMessageById(Long id) {
        return messageRepository.findById(id).orElse(null);
    }
    
    /**
     * 获取所有留言列表
     * @return 留言列表
     */
    @Override
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }
    
    /**
     * 根据状态获取留言列表
     * @param status 留言状态（0-未回复，1-已回复）
     * @return 留言列表
     */
    @Override
    public List<Message> getMessagesByStatus(Integer status) {
        return messageRepository.findByStatus(status, Pageable.unpaged()).getContent();
    }
    
    /**
     * 回复留言
     * @param id 留言ID
     * @param reply 回复内容
     * @return 更新后的留言对象
     */
    @Override
    public Message replyMessage(Long id, String reply) {
        Message message = getMessageById(id);
        if (message != null) {
            message.setReply(reply);
            message.setStatus(1); // 设置为已回复状态
            return messageRepository.save(message);
        }
        return null;
    }

    /**
     * 获取所有留言
     * @return 留言列表
     */
    @Override
    public List<Message> findAll() {
        return messageRepository.findAll();
    }

    /**
     * 根据状态获取留言
     * @param status 留言状态
     * @return 留言列表
     */
    @Override
    public List<Message> findByStatus(Integer status) {
        return messageRepository.findByStatus(status, Pageable.unpaged()).getContent();
    }

    @Override
    public Page<Message> findByStatus(Integer status, Pageable pageable) {
        return messageRepository.findByStatus(status, pageable);
    }

    @Override
    public Page<Message> findAll(Pageable pageable) {
        return messageRepository.findAll(pageable);
    }

    @Override
    public List<Message> findByUserId(Long userId) {
        return messageRepository.findByUserId(userId);
    }

    @Override
    public Message updateStatus(Long id, Integer status) {
        Message message = getMessageById(id);
        if (message != null) {
            message.setStatus(status);
            return messageRepository.save(message);
        }
        return null;
    }
}