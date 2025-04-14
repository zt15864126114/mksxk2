package com.maxxinke.controller;

import com.maxxinke.entity.Product;
import com.maxxinke.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 产品统计控制器
 * 提供产品相关的统计数据和热门产品查询
 */
@RestController
@RequestMapping("/api/product-stats")
public class ProductStatsController {

    @Autowired
    private ProductService productService;

    /**
     * 获取产品统计概览
     * @return 包含总数、本月新增、总访问量的统计数据
     */
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getProductStats() {
        return ResponseEntity.ok(productService.getProductStats());
    }

    /**
     * 获取产品分类统计
     * @return 各分类的产品数量统计
     */
    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategoryStats() {
        return ResponseEntity.ok(productService.getCategoryStats());
    }

    /**
     * 获取产品新增趋势
     * @return 最近6个月的产品新增趋势
     */
    @GetMapping("/trends")
    public ResponseEntity<List<Map<String, Object>>> getProductTrends() {
        return ResponseEntity.ok(productService.getProductTrends());
    }

    /**
     * 获取热门产品
     * @param limit 返回的产品数量，默认为10
     * @return 按访问量排序的热门产品列表
     */
    @GetMapping("/hot")
    public ResponseEntity<List<Product>> getHotProducts(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(productService.getHotProducts(limit));
    }

    /**
     * 增加产品访问量
     * @param productId 产品ID
     * @return 操作结果
     */
    @PostMapping("/{productId}/increment-views")
    public ResponseEntity<Void> incrementViews(@PathVariable Long productId) {
        productService.incrementViews(productId);
        return ResponseEntity.ok().build();
    }
} 