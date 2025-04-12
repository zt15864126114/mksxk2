package com.maxxinke.controller;

import com.maxxinke.entity.File;
import com.maxxinke.service.FileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

/**
 * 文件控制器
 * 处理文件上传、下载等操作
 */
@Api(tags = "文件管理", description = "文件上传、下载、删除等接口")
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileController {
    
    private final FileService fileService;
    
    /**
     * 上传图片
     */
    @ApiOperation(value = "上传图片", notes = "上传图片并返回图片信息，包括访问URL")
    @PostMapping("/upload/image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<File> uploadImage(
            @ApiParam(value = "图片文件", required = true)
            @RequestParam("file") MultipartFile file) {
        // 验证文件类型
        if (!file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("只能上传图片文件");
        }
        // 验证文件大小
        if (file.getSize() > 10 * 1024 * 1024) { // 10MB
            throw new IllegalArgumentException("图片大小不能超过10MB");
        }
        return ResponseEntity.ok(fileService.uploadFile(file, 1L)); // 使用管理员ID
    }
    
    /**
     * 删除文件
     */
    @ApiOperation(value = "删除文件", notes = "根据文件ID删除文件")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFile(
            @ApiParam(value = "文件ID", required = true)
            @PathVariable Long id) {
        fileService.deleteFile(id);
        return ResponseEntity.ok().build();
    }
    
    /**
     * 获取文件信息
     */
    @ApiOperation(value = "获取文件信息", notes = "根据文件ID获取文件详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<File> getFileById(
            @ApiParam(value = "文件ID", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(fileService.getFileById(id));
    }
    
    /**
     * 获取用户的文件列表
     */
    @ApiOperation(value = "获取用户文件列表", notes = "获取指定用户上传的所有文件")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<File>> getFilesByUserId(
            @ApiParam(value = "用户ID", required = true)
            @PathVariable Long userId) {
        return ResponseEntity.ok(fileService.getFilesByUserId(userId));
    }
    
    /**
     * 获取文件访问URL
     */
    @ApiOperation(value = "获取文件访问URL", notes = "获取文件的临时访问URL")
    @GetMapping("/url")
    public ResponseEntity<String> getFileUrl(
            @ApiParam(value = "文件URL", required = true)
            @RequestParam String fileUrl) {
        return ResponseEntity.ok(fileService.generateSignedUrl(fileUrl));
    }
} 