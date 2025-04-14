package com.maxxinke.controller;

import com.maxxinke.service.SystemConfigService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

/**
 * 系统配置控制器
 * 处理系统配置相关的请求，包括联系方式等
 */
@RestController
@RequestMapping("/api/system/config")
@RequiredArgsConstructor
@Api(tags = "系统配置", description = "系统配置相关接口")
public class SystemConfigController {
    
    private final SystemConfigService systemConfigService;
    
    /**
     * 获取联系方式配置
     * @return 联系方式配置Map
     */
    @ApiOperation(value = "获取联系方式", notes = "获取系统的联系方式配置")
    @GetMapping("/contact")
    public ResponseEntity<Map<String, String>> getContactInfo() {
        return ResponseEntity.ok(systemConfigService.getContactInfo());
    }
    
    /**
     * 更新联系方式配置
     * 需要管理员权限
     * @param contactInfo 联系方式配置Map
     * @return 更新结果
     */
    @ApiOperation(value = "更新联系方式", notes = "更新系统的联系方式配置")
    @PutMapping("/contact")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateContactInfo(@RequestBody Map<String, String> contactInfo) {
        int updated = systemConfigService.saveContactInfo(contactInfo);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "联系方式配置已更新");
        result.put("updated", updated);
        return ResponseEntity.ok(result);
    }
} 