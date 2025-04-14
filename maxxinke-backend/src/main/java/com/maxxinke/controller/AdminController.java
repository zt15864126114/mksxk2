package com.maxxinke.controller;

import com.maxxinke.entity.Admin;
import com.maxxinke.service.AdminService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 管理员控制器
 * 处理管理员账号的CRUD操作
 */
@Api(tags = "管理员管理", description = "管理员账号的增删改查接口")
@RestController
@RequestMapping("/api/admins")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    /**
     * 创建管理员账号
     */
    @ApiOperation(value = "创建管理员", notes = "创建新的管理员账号，需要超级管理员权限")
    @PostMapping
    public ResponseEntity<Admin> createAdmin(
            @ApiParam(value = "管理员信息", required = true)
            @RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.createAdmin(admin));
    }
    
    /**
     * 更新管理员信息
     */
    @ApiOperation(value = "更新管理员", notes = "更新管理员信息，包括密码等")
    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(
            @ApiParam(value = "管理员ID", required = true)
            @PathVariable Long id,
            @ApiParam(value = "管理员信息", required = true)
            @RequestBody Admin admin) {
        return ResponseEntity.ok(adminService.updateAdmin(id, admin));
    }
    
    /**
     * 删除管理员账号
     */
    @ApiOperation(value = "删除管理员", notes = "删除指定ID的管理员账号")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(
            @ApiParam(value = "管理员ID", required = true)
            @PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok().build();
    }
    
    /**
     * 获取所有管理员列表
     */
    @ApiOperation(value = "获取管理员列表", notes = "获取所有管理员账号的列表")
    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.findAll());
    }
    
    /**
     * 获取当前登录的管理员信息
     */
    @ApiOperation(value = "获取当前管理员", notes = "获取当前登录的管理员信息")
    @GetMapping("/me")
    public ResponseEntity<Admin> getCurrentAdmin() {
        return ResponseEntity.ok(adminService.getCurrentAdmin());
    }
    
    /**
     * 根据ID获取管理员信息
     */
    @ApiOperation(value = "获取管理员详情", notes = "根据ID获取管理员详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<Admin> getAdminById(
            @ApiParam(value = "管理员ID", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
    }
    
    /**
     * 更新管理员密码
     */
    @ApiOperation(value = "更新密码", notes = "更新指定管理员的密码")
    @PutMapping("/{id}/password")
    public ResponseEntity<Void> updatePassword(
            @ApiParam(value = "管理员ID", required = true)
            @PathVariable Long id,
            @ApiParam(value = "新密码", required = true)
            @RequestBody String newPassword) {
        adminService.updatePassword(id, newPassword);
        return ResponseEntity.ok().build();
    }
    
    /**
     * 验证管理员密码
     */
    @ApiOperation(value = "验证密码", notes = "验证指定管理员的密码是否正确")
    @PostMapping("/{id}/validate-password")
    public ResponseEntity<Boolean> validatePassword(
            @ApiParam(value = "管理员ID", required = true)
            @PathVariable Long id,
            @ApiParam(value = "密码", required = true)
            @RequestBody String password) {
        Admin admin = adminService.getAdminById(id);
        if (admin == null) {
            return ResponseEntity.notFound().build();
        }
        
        boolean isValid = adminService.validatePassword(password, admin.getPassword());
        if (isValid) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(400).body(false);
        }
    }
} 