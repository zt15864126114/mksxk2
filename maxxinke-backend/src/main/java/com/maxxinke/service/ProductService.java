package com.maxxinke.service;

import com.maxxinke.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

/**
 * 产品服务接口
 * 定义产品相关的业务操作，包括产品的CRUD操作和按状态、分类查询等功能
 */
public interface ProductService {
    /**
     * 创建产品
     * @param product 产品实体对象
     * @return 创建成功的产品对象
     */
    Product createProduct(Product product);
    
    /**
     * 更新产品
     * @param product 产品实体对象
     * @return 更新后的产品对象
     */
    Product updateProduct(Product product);
    
    /**
     * 删除产品
     * @param id 产品ID
     */
    void deleteProduct(Long id);
    
    /**
     * 根据ID获取产品
     * @param id 产品ID
     * @return 产品对象
     */
    Product getProductById(Long id);
    
    /**
     * 根据状态和分类分页获取产品
     * @param status 产品状态
     * @param category 产品分类
     * @param pageable 分页参数
     * @return 产品分页对象
     */
    Page<Product> getProductsByStatusAndCategory(Integer status, String category, Pageable pageable);
    
    /**
     * 根据状态和分类获取产品列表
     * @param status 产品状态
     * @param category 产品分类
     * @return 产品列表
     */
    List<Product> getProductsByStatusAndCategory(Integer status, String category);
    
    /**
     * 根据状态分页获取产品
     * @param status 产品状态
     * @param pageable 分页参数
     * @return 产品分页对象
     */
    Page<Product> getProductsByStatus(Integer status, Pageable pageable);
    
    /**
     * 根据状态获取产品列表
     * @param status 产品状态
     * @return 产品列表
     */
    List<Product> getProductsByStatus(Integer status);
    
    /**
     * 根据状态和分类获取产品列表，按排序值和创建时间降序排列
     * @param status 产品状态
     * @param category 产品分类
     * @return 产品列表
     */
    List<Product> getProductsByStatusAndCategoryOrderBySortDescCreateTimeDesc(Integer status, String category);

    List<Product> getAllProducts();

    List<Product> getProductsByCategory(String category);

    Product updateProductSort(Long id, Integer sort);

    List<Product> findAll();
    
    /**
     * 分页获取所有产品
     * @param pageable 分页参数
     * @return 产品分页列表
     */
    Page<Product> findAll(Pageable pageable);
} 