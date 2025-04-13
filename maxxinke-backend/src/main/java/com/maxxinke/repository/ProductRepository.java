package com.maxxinke.repository;

import com.maxxinke.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
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

    /**
     * 按分类统计产品数量
     * 返回每个分类的产品总数
     *
     * @return 包含分类名称和产品数量的数组列表，每个数组包含两个元素：
     *         - 第一个元素(String): 分类名称
     *         - 第二个元素(Long): 该分类的产品数量
     */
    @Query("SELECT p.category as category, COUNT(p) as count " +
           "FROM Product p " +
           "WHERE p.status = 1 " +
           "GROUP BY p.category " +
           "ORDER BY COUNT(p) DESC")
    List<Object[]> countByCategory();
} 