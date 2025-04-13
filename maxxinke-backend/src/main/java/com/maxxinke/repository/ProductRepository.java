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

    /**
     * 统计每月新增产品数量
     * 返回最近6个月的产品新增趋势
     *
     * @return 包含月份和新增数量的数组列表
     */
    @Query(value = "SELECT DATE_FORMAT(create_time, '%Y-%m') as month, COUNT(*) as count " +
           "FROM product " +
           "WHERE status = 1 " +
           "AND create_time >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) " +
           "GROUP BY DATE_FORMAT(create_time, '%Y-%m') " +
           "ORDER BY month DESC", nativeQuery = true)
    List<Object[]> countProductTrends();

    /**
     * 获取热门产品列表
     * 基于访问量排序，返回前N个产品
     *
     * @param limit 返回的产品数量
     * @return 热门产品列表
     */
    @Query("SELECT p FROM Product p " +
           "WHERE p.status = 1 " +
           "ORDER BY p.views DESC")
    List<Product> findHotProducts(Pageable limit);

    /**
     * 获取产品总览统计
     * 返回产品总数、本月新增数、访问总量等
     *
     * @return 统计数据数组：[总数, 本月新增, 总访问量]
     */
    @Query(value = "SELECT " +
           "(SELECT COUNT(*) FROM product WHERE status = 1) as total, " +
           "(SELECT COUNT(*) FROM product WHERE status = 1 AND create_time >= DATE_FORMAT(CURDATE(), '%Y-%m-01')) as monthNew, " +
           "(SELECT SUM(views) FROM product WHERE status = 1) as totalViews", 
           nativeQuery = true)
    Object[] getProductOverview();
    
    /**
     * 根据状态和分类查找产品
     * @param status 产品状态
     * @param category 产品分类
     * @param pageable 分页参数
     * @return 产品分页列表
     */
    Page<Product> findByStatusAndCategory(Integer status, String category, Pageable pageable);
    
    /**
     * 根据状态和分类查找产品
     * @param status 产品状态
     * @param category 产品分类
     * @return 产品列表
     */
    List<Product> findByStatusAndCategory(Integer status, String category);
    
    /**
     * 根据状态查找产品
     * @param status 产品状态
     * @param pageable 分页参数
     * @return 产品分页列表
     */
    Page<Product> findByStatus(Integer status, Pageable pageable);
    
    /**
     * 根据状态查找产品
     * @param status 产品状态
     * @return 产品列表
     */
    List<Product> findByStatus(Integer status);
} 