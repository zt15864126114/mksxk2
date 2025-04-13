package com.maxxinke.service;

import com.maxxinke.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

/**
 * 产品服务接口
 * 定义产品相关的业务操作，包括产品的CRUD操作和按状态、分类查询等功能
 */
public interface ProductService {
    Product createProduct(Product product);
    Product updateProduct(Product product);
    void deleteProduct(Long id);
    Product getProductById(Long id);
    Page<Product> getProductsByStatusAndCategory(Integer status, String category, Pageable pageable);
    List<Product> getProductsByStatusAndCategory(Integer status, String category);
    Page<Product> getProductsByStatus(Integer status, Pageable pageable);
    List<Product> getProductsByStatus(Integer status);
    List<Product> getProductsByStatusAndCategoryOrderBySortDescCreateTimeDesc(Integer status, String category);
    List<Product> getAllProducts();
    List<Product> getProductsByCategory(String category);
    Product updateProductSort(Long id, Integer sort);
    List<Product> findAll();
    Page<Product> findAll(Pageable pageable);
    Map<String, Object> getProductStats();
    List<Map<String, Object>> getCategoryStats();
    List<Map<String, Object>> getProductTrends();
    List<Product> getHotProducts(int limit);
    void incrementViews(Long productId);
} 