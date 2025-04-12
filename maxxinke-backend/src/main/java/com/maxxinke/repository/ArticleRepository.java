package com.maxxinke.repository;

import com.maxxinke.entity.Article;
import com.maxxinke.entity.ArticleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByStatus(ArticleStatus status);
    List<Article> findByAuthorId(Long authorId);
    List<Article> findByAuthorIdAndStatus(Long authorId, ArticleStatus status);
} 