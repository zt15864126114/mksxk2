package com.maxxinke.repository;

import com.maxxinke.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * 产品类别仓库接口
 * 提供对product_categories表的数据访问操作
 */
@Repository
public interface ProductCategoryRepository extends JpaRepository<ProductCategory, Long> {
    
    /**
     * 按状态查询产品类别列表，并按排序值降序排列
     * @param status 状态（0-禁用，1-启用）
     * @return 产品类别列表
     */
    List<ProductCategory> findByStatusOrderBySortDesc(Integer status);
    
    /**
     * 查询所有产品类别列表，并按排序值降序排列
     * @return 产品类别列表
     */
    List<ProductCategory> findAllByOrderBySortDesc();
    
    /**
     * 按类别名称查询产品类别
     * @param name 类别名称
     * @return 产品类别
     */
    ProductCategory findByName(String name);
} 