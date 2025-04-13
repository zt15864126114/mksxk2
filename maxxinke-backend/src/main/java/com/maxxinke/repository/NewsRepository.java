package com.maxxinke.repository;

import com.maxxinke.entity.News;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    Page<News> findByStatusAndTypeOrderByCreateTimeDesc(Integer status, String type, Pageable pageable);
    List<News> findByStatusAndTypeOrderByCreateTimeDesc(Integer status, String type);
    Page<News> findByStatusOrderByCreateTimeDesc(Integer status, Pageable pageable);
    List<News> findByStatusOrderByCreateTimeDesc(Integer status);
    List<News> findByType(String type);
    List<News> findTop5ByOrderByCreateTimeDesc();
} 