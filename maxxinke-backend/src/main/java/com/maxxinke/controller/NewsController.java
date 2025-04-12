package com.maxxinke.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.maxxinke.entity.News;
import com.maxxinke.exception.BusinessException;
import com.maxxinke.service.NewsService;
import com.maxxinke.utils.OssUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * 新闻控制器
 * 处理新闻的增删改查操作
 */
@Slf4j
@Api(tags = "新闻管理", description = "新闻的增删改查接口")
@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsController {
    
    private final NewsService newsService;
    private final OssUtil ossUtil;
    
    /**
     * 获取所有新闻
     * 
     * @return 新闻列表
     */
    @ApiOperation(value = "获取所有新闻", notes = "获取所有新闻文章列表")
    @GetMapping("/all")
    public ResponseEntity<List<News>> getAllNews() {
        return ResponseEntity.ok(newsService.getAllNews());
    }
    
    /**
     * 创建新闻
     * 需要管理员权限
     */
    @ApiOperation(value = "创建新闻", notes = "创建新的新闻文章，支持上传图片")
    @PostMapping(consumes = { "multipart/form-data" })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<News> createNews(
            @ApiParam(value = "新闻信息", required = true)
            @RequestPart(value = "news", required = true) String newsJson,
            @ApiParam(value = "新闻图片")
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            News news = mapper.readValue(newsJson, News.class);
            
            // 如果上传了图片，处理图片上传
            if (image != null && !image.isEmpty()) {
                // 验证文件类型
                if (!image.getContentType().startsWith("image/")) {
                    throw BusinessException.invalidFileType();
                }
                // 验证文件大小（10MB）
                if (image.getSize() > 10 * 1024 * 1024) {
                    throw BusinessException.fileTooLarge();
                }
                try {
                    String imageUrl = ossUtil.uploadFile(image);
                    news.setImage(imageUrl);
                } catch (IOException e) {
                    throw BusinessException.uploadFailed();
                }
            }
            
            return ResponseEntity.ok(newsService.createNews(news));
        } catch (IOException e) {
            throw new BusinessException("处理请求失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新新闻
     * 需要管理员权限
     */
    @ApiOperation(value = "更新新闻", notes = "更新已有的新闻文章，支持更新图片")
    @PostMapping(value = "/{id}", consumes = { "multipart/form-data" })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<News> updateNews(
            @ApiParam(value = "新闻ID", required = true)
            @PathVariable Long id,
            @ApiParam(value = "新闻信息", required = true)
            @RequestPart(value = "news", required = true) String newsJson,
            @ApiParam(value = "新闻图片")
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            // 获取现有新闻
            News existingNews = newsService.getNewsById(id);
            
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            News updatedNews = mapper.readValue(newsJson, News.class);
            updatedNews.setId(id);
            
            // 如果上传了新图片，处理图片上传
            if (image != null && !image.isEmpty()) {
                // 验证文件类型
                if (!image.getContentType().startsWith("image/")) {
                    throw BusinessException.invalidFileType();
                }
                // 验证文件大小（10MB）
                if (image.getSize() > 10 * 1024 * 1024) {
                    throw BusinessException.fileTooLarge();
                }
                try {
                    // 如果存在旧图片，先删除
                    String oldImageUrl = existingNews.getImage();
                    if (oldImageUrl != null && !oldImageUrl.isEmpty()) {
                        try {
                            ossUtil.deleteFile(oldImageUrl);
                            log.info("成功删除旧的新闻图片: {}", oldImageUrl);
                        } catch (Exception e) {
                            log.warn("删除旧的新闻图片失败: {}, 错误: {}", oldImageUrl, e.getMessage());
                        }
                    }
                    
                    // 上传新图片
                    String imageUrl = ossUtil.uploadFile(image);
                    updatedNews.setImage(imageUrl);
                } catch (IOException e) {
                    throw BusinessException.uploadFailed();
                }
            } else {
                // 如果没有上传新图片，保留原有图片
                updatedNews.setImage(existingNews.getImage());
            }
            
            return ResponseEntity.ok(newsService.updateNews(updatedNews));
        } catch (IOException e) {
            throw new BusinessException("处理请求失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除新闻
     * 需要管理员权限
     * 
     * @param id 新闻ID
     * @return 删除结果
     */
    @ApiOperation(value = "删除新闻", notes = "删除指定的新闻文章")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteNews(
            @ApiParam(value = "新闻ID", required = true)
            @PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.ok().build();
    }
    
    /**
     * 获取指定类型的新闻
     * 
     * @param type 新闻类型
     * @return 新闻列表
     */
    @ApiOperation(value = "获取新闻列表", notes = "根据类型获取新闻列表")
    @GetMapping("/type/{type}")
    public ResponseEntity<List<News>> getNewsByType(
            @ApiParam(value = "新闻类型", required = true)
            @PathVariable String type) {
        return ResponseEntity.ok(newsService.findByType(type));
    }
    
    /**
     * 获取指定状态的新闻
     * 需要管理员权限
     * 
     * @param status 新闻状态
     * @return 新闻列表
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<News>> getNewsByStatus(@PathVariable Integer status) {
        return ResponseEntity.ok(newsService.getNewsByStatus(status));
    }

    /**
     * 获取新闻详情
     */
    @ApiOperation(value = "获取新闻详情", notes = "获取指定新闻的详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(
            @ApiParam(value = "新闻ID", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    /**
     * 分页获取新闻列表
     */
    @ApiOperation(value = "分页获取新闻", notes = "根据状态和类型分页获取新闻列表")
    @GetMapping
    public ResponseEntity<Page<News>> getNews(
            @ApiParam(value = "新闻状态：0-草稿，1-已发布", required = false)
            @RequestParam(required = false) Integer status,
            @ApiParam(value = "新闻类型", required = false)
            @RequestParam(required = false) String type,
            @ApiParam(value = "分页参数", required = true)
            Pageable pageable) {
        if (status != null && type != null) {
            return ResponseEntity.ok(newsService.getNewsByStatusAndType(status, type, pageable));
        } else if (status != null) {
            return ResponseEntity.ok(newsService.getNewsByStatus(status, pageable));
        } else {
            return ResponseEntity.ok(newsService.findAll(pageable));
        }
    }
} 