package com.maxxinke.repository;

import com.maxxinke.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByStatusAndCategoryOrderBySortDesc(Integer status, String category, Pageable pageable);
    List<Product> findByStatusAndCategoryOrderBySortDesc(Integer status, String category);
    Page<Product> findByStatusOrderBySortDesc(Integer status, Pageable pageable);
    List<Product> findByStatusOrderBySortDesc(Integer status);
    List<Product> findByStatusAndCategoryOrderBySortDescCreateTimeDesc(Integer status, String category);

    /**
     * 根据分类查找产品
     * @param category 产品分类
     * @return 产品列表
     */
    List<Product> findByCategory(String category);
} 