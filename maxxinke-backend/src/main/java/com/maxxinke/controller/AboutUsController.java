package com.maxxinke.controller;

import com.maxxinke.entity.AboutUs;
import com.maxxinke.service.AboutUsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 关于我们控制器
 * 处理关于我们信息的HTTP请求
 */
@RestController
@RequestMapping("/api/about-us")
@CrossOrigin(origins = "*")
public class AboutUsController {
    
    /**
     * 关于我们服务类
     */
    @Autowired
    private AboutUsService aboutUsService;
    
    /**
     * 获取最新的关于我们信息
     * 
     * @return 包含最新AboutUs信息的ResponseEntity
     */
    @GetMapping
    public ResponseEntity<AboutUs> getAboutUs() {
        AboutUs aboutUs = aboutUsService.getLatestAboutUs();
        return ResponseEntity.ok(aboutUs);
    }
    
    /**
     * 创建新的关于我们信息
     * 
     * @param aboutUs 要创建的AboutUs对象
     * @return 包含创建后的AboutUs信息的ResponseEntity
     */
    @PostMapping
    public ResponseEntity<AboutUs> createAboutUs(@RequestBody AboutUs aboutUs) {
        AboutUs savedAboutUs = aboutUsService.saveAboutUs(aboutUs);
        return ResponseEntity.ok(savedAboutUs);
    }
} 