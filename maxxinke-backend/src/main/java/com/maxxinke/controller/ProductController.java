package com.maxxinke.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.maxxinke.entity.Product;
import com.maxxinke.exception.BusinessException;
import com.maxxinke.service.ProductService;
import com.maxxinke.service.FileService;
import com.maxxinke.utils.OssUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * 产品控制器
 * 处理产品的增删改查操作
 */
@Slf4j
@Api(tags = "产品管理", description = "产品的增删改查接口")
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    
    private final ProductService productService;
    private final FileService fileService;
    private final OssUtil ossUtil;
    
    /**
     * 创建产品
     */
    @ApiOperation(value = "创建产品", notes = "创建新产品，包括上传产品图片")
    @PostMapping(consumes = { "multipart/form-data" })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(
            @ApiParam(value = "产品信息", required = true)
            @RequestPart(value = "product", required = true) String productJson,
            @ApiParam(value = "产品图片")
            @RequestPart(value = "image", required = false) MultipartFile image) {
        
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            Product product = mapper.readValue(productJson, Product.class);
            
            // 设置默认值
            if (product.getSort() == null) {
                product.setSort(0);
            }
            if (product.getStatus() == null) {
                product.setStatus(1);
            }
            
            // 如果上传了图片，直接使用OSS工具类上传
            if (image != null && !image.isEmpty()) {
                // 验证文件类型
                if (!image.getContentType().startsWith("image/")) {
                    throw BusinessException.invalidFileType();
                }
                // 验证文件大小（10MB）
                if (image.getSize() > 10 * 1024 * 1024) {
                    throw BusinessException.fileTooLarge();
                }
                try {
                    String imageUrl = ossUtil.uploadFile(image);
                    product.setImage(imageUrl);
                } catch (IOException e) {
                    throw BusinessException.uploadFailed();
                }
            }
            
            return ResponseEntity.ok(productService.createProduct(product));
        } catch (IOException e) {
            throw new BusinessException("处理请求失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新产品
     */
    @ApiOperation(value = "更新产品", notes = "更新产品信息，可选择更新产品图片")
    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(
            @ApiParam(value = "产品ID", required = true)
            @PathVariable Long id,
            @ApiParam(value = "产品信息", required = true)
            @RequestPart(value = "product", required = true) String productJson,
            @ApiParam(value = "产品图片")
            @RequestPart(value = "image", required = false) MultipartFile image) {
        
        try {
            // 首先获取现有产品
            Product existingProduct = productService.getProductById(id);
            if (existingProduct == null) {
                throw BusinessException.productNotFound();
            }

            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            Product updatedProduct = mapper.readValue(productJson, Product.class);
            
            // 确保设置正确的ID
            updatedProduct.setId(id);
            
            // 如果上传了新图片，更新图片
            if (image != null && !image.isEmpty()) {
                // 验证文件类型
                if (!image.getContentType().startsWith("image/")) {
                    throw BusinessException.invalidFileType();
                }
                // 验证文件大小（10MB）
                if (image.getSize() > 10 * 1024 * 1024) {
                    throw BusinessException.fileTooLarge();
                }
                try {
                    String imageUrl = ossUtil.uploadFile(image);
                    updatedProduct.setImage(imageUrl);
                } catch (IOException e) {
                    throw BusinessException.uploadFailed();
                }
            } else {
                // 如果没有上传新图片，保留原有图片
                updatedProduct.setImage(existingProduct.getImage());
            }
            
            // 保留原有的不变字段
            if (updatedProduct.getSort() == null) {
                updatedProduct.setSort(existingProduct.getSort());
            }
            if (updatedProduct.getStatus() == null) {
                updatedProduct.setStatus(existingProduct.getStatus());
            }
            
            return ResponseEntity.ok(productService.updateProduct(updatedProduct));
        } catch (IOException e) {
            throw new BusinessException("处理请求失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除产品
     */
    @ApiOperation(value = "删除产品", notes = "删除指定的产品及其图片")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(
            @ApiParam(value = "产品ID", required = true)
            @PathVariable Long id) {
        try {
            // 获取产品信息
            Product product = productService.getProductById(id);
            if (product == null) {
                throw BusinessException.productNotFound();
            }

            // 删除OSS上的图片
            String imageUrl = product.getImage();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                log.info("开始删除产品图片: {}", imageUrl);
                try {
                    ossUtil.deleteFile(imageUrl);
                    log.info("成功删除产品图片: {}", imageUrl);
                } catch (Exception e) {
                    log.error("删除产品图片失败: {}, 错误: {}", imageUrl, e.getMessage());
                    // 这里我们继续删除产品，但会记录错误
                }
            }

            // 删除产品
            productService.deleteProduct(id);
            log.info("成功删除产品: {}", id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("删除产品失败: {}, 错误: {}", id, e.getMessage());
            throw new BusinessException("删除产品失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取产品详情
     */
    @ApiOperation(value = "获取产品详情", notes = "获取指定产品的详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(
            @ApiParam(value = "产品ID", required = true)
            @PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            if (product == null) {
                throw new BusinessException("产品不存在，ID: " + id);
            }
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            throw new BusinessException("产品不存在，ID: " + id);
        }
    }
    
    /**
     * 分页获取产品列表
     */
    @ApiOperation(value = "分页获取产品", notes = "根据状态和分类分页获取产品列表")
    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @ApiParam(value = "产品状态：0-下架，1-上架", required = false)
            @RequestParam(required = false) Integer status,
            @ApiParam(value = "产品分类", required = false)
            @RequestParam(required = false) String category,
            @ApiParam(value = "分页参数", required = true)
            Pageable pageable) {
        try {
            Page<Product> products;
            if (status != null && category != null) {
                products = productService.getProductsByStatusAndCategory(status, category, pageable);
            } else if (status != null) {
                products = productService.getProductsByStatus(status, pageable);
            } else {
                products = productService.findAll(pageable);
            }
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            throw new BusinessException("获取产品列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 根据分类获取产品列表
     */
    @ApiOperation(value = "获取分类产品", notes = "获取指定分类的所有产品")
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(
            @ApiParam(value = "产品分类", required = true)
            @PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }
    
    /**
     * 更新产品排序
     */
    @ApiOperation(value = "更新产品排序", notes = "更新产品的显示顺序")
    @PutMapping("/{id}/sort")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProductSort(
            @ApiParam(value = "产品ID", required = true)
            @PathVariable Long id,
            @ApiParam(value = "排序值", required = true)
            @RequestParam Integer sort) {
        try {
            if (sort < 0) {
                throw BusinessException.invalidParameter("排序值不能为负数");
            }
            return ResponseEntity.ok(productService.updateProductSort(id, sort));
        } catch (Exception e) {
            throw new BusinessException("更新产品排序失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取所有产品
     */
    @ApiOperation(value = "获取所有产品", notes = "获取所有产品列表")
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
} 