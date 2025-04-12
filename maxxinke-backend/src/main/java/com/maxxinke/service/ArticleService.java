package com.maxxinke.service;

import com.maxxinke.entity.Article;
import com.maxxinke.entity.ArticleStatus;
import java.util.List;

/**
 * 文章服务接口
 * 定义文章相关的业务操作，包括文章的CRUD操作和按状态、作者查询等功能
 */
public interface ArticleService {
    /**
     * 创建文章
     * @param article 文章实体对象
     * @return 创建成功的文章对象
     */
    Article createArticle(Article article);
    
    /**
     * 更新文章
     * @param id 文章ID
     * @param article 文章实体对象
     * @return 更新后的文章对象
     */
    Article updateArticle(Long id, Article article);
    
    /**
     * 删除文章
     * @param id 文章ID
     */
    void deleteArticle(Long id);
    
    /**
     * 根据ID获取文章
     * @param id 文章ID
     * @return 文章对象
     */
    Article getArticleById(Long id);
    
    /**
     * 获取所有文章
     * @return 文章列表
     */
    List<Article> getAllArticles();
    
    /**
     * 根据状态获取文章
     * @param status 文章状态
     * @return 文章列表
     */
    List<Article> getArticlesByStatus(ArticleStatus status);
    
    /**
     * 根据作者ID获取文章
     * @param authorId 作者ID
     * @return 文章列表
     */
    List<Article> getArticlesByAuthor(Long authorId);
    
    /**
     * 根据作者ID和状态获取文章
     * @param authorId 作者ID
     * @param status 文章状态
     * @return 文章列表
     */
    List<Article> getArticlesByAuthorAndStatus(Long authorId, ArticleStatus status);
} 