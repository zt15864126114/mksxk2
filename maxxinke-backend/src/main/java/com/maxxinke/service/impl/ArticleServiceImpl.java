package com.maxxinke.service.impl;

import com.maxxinke.entity.Article;
import com.maxxinke.entity.ArticleStatus;
import com.maxxinke.repository.ArticleRepository;
import com.maxxinke.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 文章服务实现类
 * 实现ArticleService接口定义的所有业务方法
 */
@Service
@Transactional
public class ArticleServiceImpl implements ArticleService {
    
    @Autowired
    private ArticleRepository articleRepository;
    
    /**
     * 创建新文章
     * @param article 文章实体对象
     * @return 创建成功的文章对象
     */
    @Override
    public Article createArticle(Article article) {
        return articleRepository.save(article);
    }
    
    /**
     * 更新文章信息
     * @param id 文章ID
     * @param article 文章实体对象
     * @return 更新后的文章对象
     */
    @Override
    public Article updateArticle(Long id, Article article) {
        article.setId(id);
        return articleRepository.save(article);
    }
    
    /**
     * 删除文章
     * @param id 文章ID
     */
    @Override
    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
    
    /**
     * 根据ID获取文章
     * @param id 文章ID
     * @return 文章对象
     */
    @Override
    public Article getArticleById(Long id) {
        return articleRepository.findById(id).orElse(null);
    }
    
    /**
     * 获取所有文章列表
     * @return 文章列表
     */
    @Override
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }
    
    /**
     * 根据状态获取文章列表
     * @param status 文章状态
     * @return 文章列表
     */
    @Override
    public List<Article> getArticlesByStatus(ArticleStatus status) {
        return articleRepository.findByStatus(status);
    }
    
    /**
     * 根据作者ID获取文章列表
     * @param authorId 作者ID
     * @return 文章列表
     */
    @Override
    public List<Article> getArticlesByAuthor(Long authorId) {
        return articleRepository.findByAuthorId(authorId);
    }
    
    /**
     * 根据作者ID和文章状态获取文章列表
     * @param authorId 作者ID
     * @param status 文章状态
     * @return 文章列表
     */
    @Override
    public List<Article> getArticlesByAuthorAndStatus(Long authorId, ArticleStatus status) {
        return articleRepository.findByAuthorIdAndStatus(authorId, status);
    }
} 