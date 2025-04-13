package com.maxxinke.service.impl;

import com.maxxinke.entity.Product;
import com.maxxinke.exception.BusinessException;
import com.maxxinke.repository.ProductRepository;
import com.maxxinke.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

/**
 * 产品服务实现类
 * 实现ProductService接口定义的所有业务方法
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    /**
     * 创建产品
     * @param product 产品实体对象
     * @return 创建成功的产品对象
     */
    @Override
    @Transactional
    public Product createProduct(Product product) {
        try {
            log.info("开始创建产品: {}", product.getName());
            Product savedProduct = productRepository.save(product);
            log.info("产品创建成功: {}", savedProduct.getId());
            return savedProduct;
        } catch (Exception e) {
            log.error("创建产品失败: {}, 错误: {}", product.getName(), e.getMessage());
            throw new BusinessException("创建产品失败: " + e.getMessage());
        }
    }

    /**
     * 更新产品
     * @param product 产品实体对象
     * @return 更新后的产品对象
     */
    @Override
    @Transactional
    public Product updateProduct(Product product) {
        try {
            log.info("开始更新产品: {}", product.getId());
            Product existingProduct = productRepository.findById(product.getId())
                    .orElseThrow(() -> new BusinessException("产品不存在，ID: " + product.getId()));
            
            // 更新需要更新的字段
            if (product.getName() != null) {
                existingProduct.setName(product.getName());
            }
            if (product.getCategory() != null) {
                existingProduct.setCategory(product.getCategory());
            }
            if (product.getDescription() != null) {
                existingProduct.setDescription(product.getDescription());
            }
            if (product.getSpecification() != null) {
                existingProduct.setSpecification(product.getSpecification());
            }
            if (product.getApplication() != null) {
                existingProduct.setApplication(product.getApplication());
            }
            if (product.getImage() != null) {
                existingProduct.setImage(product.getImage());
            }
            if (product.getSort() != null) {
                existingProduct.setSort(product.getSort());
            }
            if (product.getStatus() != null) {
                existingProduct.setStatus(product.getStatus());
            }
            
            Product updatedProduct = productRepository.save(existingProduct);
            log.info("产品更新成功: {}", updatedProduct.getId());
            return updatedProduct;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("更新产品失败: {}, 错误: {}", product.getId(), e.getMessage());
            throw new BusinessException("更新产品失败: " + e.getMessage());
        }
    }

    /**
     * 删除产品
     * @param id 产品ID
     */
    @Override
    @Transactional
    public void deleteProduct(Long id) {
        try {
            log.info("开始删除产品: {}", id);
            if (!productRepository.existsById(id)) {
                throw new BusinessException("产品不存在，ID: " + id);
            }
            productRepository.deleteById(id);
            log.info("产品删除成功: {}", id);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("删除产品失败: {}, 错误: {}", id, e.getMessage());
            throw new BusinessException("删除产品失败: " + e.getMessage());
        }
    }

    /**
     * 根据ID获取产品
     * @param id 产品ID
     * @return 产品对象
     */
    @Override
    public Product getProductById(Long id) {
        try {
            log.debug("获取产品信息: {}", id);
            return productRepository.findById(id)
                    .orElseThrow(() -> new BusinessException("产品不存在，ID: " + id));
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("获取产品失败: {}, 错误: {}", id, e.getMessage());
            throw new BusinessException("获取产品失败: " + e.getMessage());
        }
    }

    /**
     * 根据状态和分类分页获取产品
     * @param status 产品状态
     * @param category 产品分类
     * @param pageable 分页参数
     * @return 产品分页对象
     */
    @Override
    public Page<Product> getProductsByStatusAndCategory(Integer status, String category, Pageable pageable) {
        return productRepository.findByStatusAndCategoryOrderBySortDesc(status, category, pageable);
    }

    /**
     * 根据状态和分类获取产品列表
     * @param status 产品状态
     * @param category 产品分类
     * @return 产品列表
     */
    @Override
    public List<Product> getProductsByStatusAndCategory(Integer status, String category) {
        return productRepository.findByStatusAndCategoryOrderBySortDesc(status, category);
    }

    /**
     * 根据状态分页获取产品
     * @param status 产品状态
     * @param pageable 分页参数
     * @return 产品分页对象
     */
    @Override
    public Page<Product> getProductsByStatus(Integer status, Pageable pageable) {
        return productRepository.findByStatusOrderBySortDesc(status, pageable);
    }

    /**
     * 根据状态获取产品列表
     * @param status 产品状态
     * @return 产品列表
     */
    @Override
    public List<Product> getProductsByStatus(Integer status) {
        return productRepository.findByStatusOrderBySortDesc(status);
    }

    /**
     * 根据状态和分类获取产品列表，按排序和创建时间降序排列
     * @param status 产品状态
     * @param category 产品分类
     * @return 产品列表
     */
    @Override
    public List<Product> getProductsByStatusAndCategoryOrderBySortDescCreateTimeDesc(Integer status, String category) {
        return productRepository.findByStatusAndCategoryOrderBySortDescCreateTimeDesc(status, category);
    }

    /**
     * 更新产品排序
     * @param id 产品ID
     * @param sort 排序值
     * @return 更新后的产品对象
     */
    @Override
    @Transactional
    public Product updateProductSort(Long id, Integer sort) {
        Product product = getProductById(id);
        product.setSort(sort);
        return productRepository.save(product);
    }

    /**
     * 获取所有产品
     * @return 产品列表
     */
    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /**
     * 根据分类获取产品列表
     * @param category 产品分类
     * @return 产品列表
     */
    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Page<Product> findAll(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public List<Map<String, Object>> getProductTrends() {
        return productRepository.countProductTrends().stream()
                .map(row -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("month", row[0]);
                    item.put("count", row[1]);
                    return item;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getCategoryStats() {
        return productRepository.countByCategory().stream()
                .map(row -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("category", row[0]);
                    item.put("count", row[1]);
                    return item;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Product> getHotProducts(int limit) {
        return productRepository.findHotProducts(PageRequest.of(0, limit));
    }

    @Override
    @Transactional
    public void incrementViews(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setViews(product.getViews() + 1);
        productRepository.save(product);
    }

    @Override
    public Map<String, Object> getProductStats() {
        Object[] overview = productRepository.getProductOverview();
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", overview[0]);
        stats.put("monthNew", overview[1]);
        stats.put("totalViews", overview[2]);
        return stats;
    }
} 