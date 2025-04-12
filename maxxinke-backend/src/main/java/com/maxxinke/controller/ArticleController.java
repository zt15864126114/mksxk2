package com.maxxinke.controller;

import com.maxxinke.entity.Article;
import com.maxxinke.entity.ArticleStatus;
import com.maxxinke.service.ArticleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 文章控制器
 * 处理文章相关的请求
 */
@Api(tags = "文章管理", description = "文章的增删改查接口")
@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    
    @Autowired
    private ArticleService articleService;
    
    /**
     * 获取所有已发布的文章
     */
    @ApiOperation(value = "获取已发布文章", notes = "获取所有已发布状态的文章列表")
    @GetMapping
    public ResponseEntity<List<Article>> getAllPublishedArticles() {
        return ResponseEntity.ok(articleService.getArticlesByStatus(ArticleStatus.PUBLISHED));
    }
    
    /**
     * 获取文章详情
     */
    @ApiOperation(value = "获取文章详情", notes = "获取指定文章的详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticle(
            @ApiParam(value = "文章ID", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(articleService.getArticleById(id));
    }
    
    /**
     * 创建新文章
     */
    @ApiOperation(value = "创建文章", notes = "创建新的文章（需要管理员权限）")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Article> createArticle(
            @ApiParam(value = "文章信息", required = true)
            @RequestBody Article article) {
        return ResponseEntity.ok(articleService.createArticle(article));
    }
    
    /**
     * 更新文章
     */
    @ApiOperation(value = "更新文章", notes = "更新已有的文章信息（需要管理员权限）")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Article> updateArticle(
            @ApiParam(value = "文章ID", required = true)
            @PathVariable Long id,
            @ApiParam(value = "文章信息", required = true)
            @RequestBody Article article) {
        return ResponseEntity.ok(articleService.updateArticle(id, article));
    }
    
    /**
     * 删除文章
     */
    @ApiOperation(value = "删除文章", notes = "删除指定的文章（需要管理员权限）")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteArticle(
            @ApiParam(value = "文章ID", required = true)
            @PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.ok().build();
    }
    
    /**
     * 获取指定作者的文章
     */
    @ApiOperation(value = "获取作者文章", notes = "获取指定作者的所有文章列表")
    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<Article>> getArticlesByAuthor(
            @ApiParam(value = "作者ID", required = true)
            @PathVariable Long authorId) {
        return ResponseEntity.ok(articleService.getArticlesByAuthor(authorId));
    }
    
    /**
     * 获取指定状态的文章
     */
    @ApiOperation(value = "获取状态文章", notes = "获取指定状态的所有文章（需要管理员权限）")
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Article>> getArticlesByStatus(
            @ApiParam(value = "文章状态：DRAFT-草稿，PUBLISHED-已发布，ARCHIVED-已归档", required = true)
            @PathVariable ArticleStatus status) {
        return ResponseEntity.ok(articleService.getArticlesByStatus(status));
    }
} 