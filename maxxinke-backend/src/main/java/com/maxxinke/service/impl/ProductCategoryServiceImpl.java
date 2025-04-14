package com.maxxinke.service.impl;

import com.maxxinke.entity.ProductCategory;
import com.maxxinke.repository.ProductCategoryRepository;
import com.maxxinke.service.ProductCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 产品类别服务实现类
 */
@Service
public class ProductCategoryServiceImpl implements ProductCategoryService {

    @Autowired
    private ProductCategoryRepository productCategoryRepository;

    /**
     * 获取所有启用的产品类别列表
     * @return 产品类别列表
     */
    @Override
    public List<ProductCategory> getAllEnabledCategories() {
        return productCategoryRepository.findByStatusOrderBySortDesc(1);
    }

    /**
     * 获取所有产品类别列表
     * @return 产品类别列表
     */
    @Override
    public List<ProductCategory> getAllCategories() {
        return productCategoryRepository.findAllByOrderBySortDesc();
    }

    /**
     * 根据ID获取产品类别
     * @param id 类别ID
     * @return 产品类别
     */
    @Override
    public ProductCategory getCategoryById(Long id) {
        return productCategoryRepository.findById(id).orElse(null);
    }

    /**
     * 根据名称获取产品类别
     * @param name 类别名称
     * @return 产品类别
     */
    @Override
    public ProductCategory getCategoryByName(String name) {
        return productCategoryRepository.findByName(name);
    }

    /**
     * 创建或更新产品类别
     * @param category 产品类别
     * @return 保存后的产品类别
     */
    @Override
    @Transactional
    public ProductCategory saveCategory(ProductCategory category) {
        return productCategoryRepository.save(category);
    }

    /**
     * 删除产品类别
     * @param id 类别ID
     */
    @Override
    @Transactional
    public void deleteCategory(Long id) {
        productCategoryRepository.deleteById(id);
    }
} 