package com.maxxinke.service;

import com.maxxinke.entity.ProductCategory;
import java.util.List;

/**
 * 产品类别服务接口
 * 定义产品类别相关的业务操作
 */
public interface ProductCategoryService {
    
    /**
     * 获取所有启用的产品类别列表
     * @return 产品类别列表
     */
    List<ProductCategory> getAllEnabledCategories();
    
    /**
     * 获取所有产品类别列表
     * @return 产品类别列表
     */
    List<ProductCategory> getAllCategories();
    
    /**
     * 根据ID获取产品类别
     * @param id 类别ID
     * @return 产品类别
     */
    ProductCategory getCategoryById(Long id);
    
    /**
     * 根据名称获取产品类别
     * @param name 类别名称
     * @return 产品类别
     */
    ProductCategory getCategoryByName(String name);
    
    /**
     * 创建或更新产品类别
     * @param category 产品类别
     * @return 保存后的产品类别
     */
    ProductCategory saveCategory(ProductCategory category);
    
    /**
     * 删除产品类别
     * @param id 类别ID
     */
    void deleteCategory(Long id);
} 