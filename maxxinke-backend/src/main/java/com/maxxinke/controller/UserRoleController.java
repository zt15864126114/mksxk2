package com.maxxinke.controller;

import com.maxxinke.entity.UserRole;
import com.maxxinke.service.UserRoleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 用户角色控制器
 * 处理用户角色相关的HTTP请求，包括用户角色的CRUD操作
 * 所有操作都需要管理员权限
 */
@Api(tags = "用户角色管理", description = "用户角色的增删改查接口（需要管理员权限）")
@RestController
@RequestMapping("/api/user-roles")
public class UserRoleController {
    
    @Autowired
    private UserRoleService userRoleService;
    
    /**
     * 获取所有用户角色
     */
    @ApiOperation(value = "获取所有角色", notes = "获取系统中所有用户角色信息（需要管理员权限）")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserRole>> getAllUserRoles() {
        return ResponseEntity.ok(userRoleService.findAll());
    }
    
    /**
     * 创建用户角色
     */
    @ApiOperation(value = "创建角色", notes = "创建新的用户角色（需要管理员权限）")
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserRole> createUserRole(
            @ApiParam(value = "角色信息", required = true)
            @RequestBody UserRole userRole) {
        return ResponseEntity.ok(userRoleService.createUserRole(userRole));
    }
    
    /**
     * 更新用户角色
     */
    @ApiOperation(value = "更新角色", notes = "更新指定的用户角色信息（需要管理员权限）")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserRole> updateUserRole(
            @ApiParam(value = "角色ID", required = true)
            @PathVariable Long id,
            @ApiParam(value = "角色信息", required = true)
            @RequestBody UserRole userRole) {
        return ResponseEntity.ok(userRoleService.updateUserRole(id, userRole));
    }
    
    /**
     * 删除用户角色
     */
    @ApiOperation(value = "删除角色", notes = "删除指定的用户角色（需要管理员权限）")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUserRole(
            @ApiParam(value = "角色ID", required = true)
            @PathVariable Long id) {
        userRoleService.deleteUserRole(id);
        return ResponseEntity.ok().build();
    }
    
    /**
     * 获取指定用户的角色
     */
    @ApiOperation(value = "获取用户角色", notes = "获取指定用户的所有角色信息")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserRole>> getUserRolesByUserId(
            @ApiParam(value = "用户ID", required = true)
            @PathVariable Long userId) {
        return ResponseEntity.ok(userRoleService.findByUserId(userId));
    }
} 