package com.maxxinke.repository;

import com.maxxinke.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByStatus(Integer status, Pageable pageable);
    List<Message> findByStatusOrderByCreateTimeDesc(Integer status);
    long countByStatus(Integer status);
    
    /**
     * 根据用户ID查找消息
     * @param userId 用户ID
     * @return 消息列表
     */
    List<Message> findByUserId(Long userId);

    List<Message> findTop5ByOrderByCreateTimeDesc();
} 