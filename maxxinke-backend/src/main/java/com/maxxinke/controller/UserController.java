package com.maxxinke.controller;

import com.maxxinke.entity.User;
import com.maxxinke.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 用户控制器
 * 处理用户相关的请求
 */
@Api(tags = "用户管理", description = "用户信息管理相关接口")
@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 获取所有用户
     */
    @ApiOperation(value = "获取所有用户", notes = "获取系统中所有用户的信息（需要管理员权限）")
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    /**
     * 获取当前用户信息
     */
    @ApiOperation(value = "获取当前用户", notes = "获取当前登录用户的详细信息")
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userService.getUserByUsername(auth.getName()));
    }
    
    /**
     * 更新用户信息
     */
    @ApiOperation(value = "更新用户信息", notes = "更新指定用户的信息")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @ApiParam(value = "用户ID", required = true)
            @PathVariable Long id,
            @ApiParam(value = "用户信息", required = true)
            @RequestBody User user) {
        user.setId(id);
        return ResponseEntity.ok(userService.updateUser(user));
    }
    
    /**
     * 删除用户
     */
    @ApiOperation(value = "删除用户", notes = "删除指定的用户（需要管理员权限）")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(
            @ApiParam(value = "用户ID", required = true)
            @PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
} 