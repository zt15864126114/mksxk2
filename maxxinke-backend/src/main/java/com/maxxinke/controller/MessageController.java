package com.maxxinke.controller;

import com.maxxinke.entity.Message;
import com.maxxinke.service.MessageService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 消息控制器
 * 处理用户消息的增删改查操作
 */
@Api(tags = "消息管理", description = "处理用户消息的相关接口")
@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    /**
     * 创建消息
     */
    @ApiOperation(value = "创建消息", notes = "创建新的用户消息")
    @PostMapping
    public ResponseEntity<Message> createMessage(
            @ApiParam(value = "消息内容", required = true)
            @RequestBody Message message) {
        return ResponseEntity.ok(messageService.createMessage(message));
    }
    
    /**
     * 回复消息
     */
    @ApiOperation(value = "回复消息", notes = "管理员回复用户消息")
    @PutMapping("/{id}/reply")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Message> replyMessage(
            @ApiParam(value = "消息ID", required = true)
            @PathVariable Long id,
            @ApiParam(value = "回复内容", required = true)
            @RequestParam String reply) {
        return ResponseEntity.ok(messageService.replyMessage(id, reply));
    }
    
    /**
     * 删除消息
     */
    @ApiOperation(value = "删除消息", notes = "删除指定的消息")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteMessage(
            @ApiParam(value = "消息ID", required = true)
            @PathVariable Long id) {
        messageService.deleteMessage(id);
        return ResponseEntity.ok().build();
    }
    
    /**
     * 获取消息详情
     */
    @ApiOperation(value = "获取消息详情", notes = "获取指定消息的详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<Message> getMessageById(
            @ApiParam(value = "消息ID", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(messageService.getMessageById(id));
    }
    
    /**
     * 分页获取消息列表
     */
    @ApiOperation(value = "分页获取消息", notes = "根据状态分页获取消息列表")
    @GetMapping
    public ResponseEntity<Page<Message>> getMessages(
            @ApiParam(value = "消息状态：0-未回复，1-已回复", required = false)
            @RequestParam(required = false) Integer status,
            @ApiParam(value = "分页参数", required = true)
            Pageable pageable) {
        if (status != null) {
            return ResponseEntity.ok(messageService.findByStatus(status, pageable));
        } else {
            return ResponseEntity.ok(messageService.findAll(pageable));
        }
    }
    
    /**
     * 获取用户的消息列表
     */
    @ApiOperation(value = "获取用户消息", notes = "获取指定用户的所有消息")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Message>> getUserMessages(
            @ApiParam(value = "用户ID", required = true)
            @PathVariable Long userId) {
        return ResponseEntity.ok(messageService.findByUserId(userId));
    }
    
    /**
     * 更新消息状态
     */
    @ApiOperation(value = "更新消息状态", notes = "更新消息的状态（已读/未读）")
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long id,
            @RequestBody String status) {
        messageService.updateStatus(id, status);
        return ResponseEntity.ok().build();
    }
    
    @ApiOperation("全部标记为已读")
    @PutMapping("/mark-all-as-read")
    public ResponseEntity<Void> markAllAsRead() {
        messageService.markAllAsRead();
        return ResponseEntity.ok().build();
    }
} 