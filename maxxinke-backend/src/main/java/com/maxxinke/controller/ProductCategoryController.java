package com.maxxinke.controller;

import com.maxxinke.entity.ProductCategory;
import com.maxxinke.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 产品类别控制器
 * 处理与产品类别相关的请求
 */
@RestController
@RequestMapping("/api/product/categories")
@CrossOrigin
public class ProductCategoryController {

    @Autowired
    private ProductCategoryService productCategoryService;

    /**
     * 获取所有启用的产品类别
     * @return 产品类别列表
     */
    @GetMapping
    public ResponseEntity<List<ProductCategory>> getAllCategories() {
        return ResponseEntity.ok(productCategoryService.getAllEnabledCategories());
    }

    /**
     * 获取所有产品类别（包括禁用的）
     * @return 产品类别列表
     */
    @GetMapping("/all")
    public ResponseEntity<List<ProductCategory>> getAllCategoriesIncludeDisabled() {
        return ResponseEntity.ok(productCategoryService.getAllCategories());
    }

    /**
     * 根据ID获取产品类别
     * @param id 类别ID
     * @return 产品类别
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductCategory> getCategoryById(@PathVariable Long id) {
        ProductCategory category = productCategoryService.getCategoryById(id);
        if (category != null) {
            return ResponseEntity.ok(category);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * 创建产品类别
     * @param category 产品类别信息
     * @return 创建的产品类别
     */
    @PostMapping
    public ResponseEntity<ProductCategory> createCategory(@RequestBody ProductCategory category) {
        return ResponseEntity.ok(productCategoryService.saveCategory(category));
    }

    /**
     * 更新产品类别
     * @param id 类别ID
     * @param category 产品类别信息
     * @return 更新后的产品类别
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductCategory> updateCategory(
            @PathVariable Long id,
            @RequestBody ProductCategory category) {
        
        ProductCategory existingCategory = productCategoryService.getCategoryById(id);
        if (existingCategory == null) {
            return ResponseEntity.notFound().build();
        }
        
        category.setId(id);
        return ResponseEntity.ok(productCategoryService.saveCategory(category));
    }

    /**
     * 删除产品类别
     * @param id 类别ID
     * @return 无内容
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        ProductCategory existingCategory = productCategoryService.getCategoryById(id);
        if (existingCategory == null) {
            return ResponseEntity.notFound().build();
        }
        
        productCategoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
} 