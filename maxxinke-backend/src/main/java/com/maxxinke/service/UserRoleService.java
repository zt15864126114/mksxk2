package com.maxxinke.service;

import com.maxxinke.entity.UserRole;
import java.util.List;

/**
 * 用户角色服务接口
 * 定义用户角色相关的业务操作，包括用户角色的CRUD操作和查询功能
 */
public interface UserRoleService {
    
    /**
     * 创建用户角色
     * @param userRole 用户角色实体对象
     * @return 创建成功的用户角色对象
     */
    UserRole createUserRole(UserRole userRole);
    
    /**
     * 更新用户角色
     * @param id 用户角色ID
     * @param userRole 用户角色实体对象
     * @return 更新后的用户角色对象
     */
    UserRole updateUserRole(Long id, UserRole userRole);
    
    /**
     * 删除用户角色
     * @param id 用户角色ID
     */
    void deleteUserRole(Long id);
    
    /**
     * 获取所有用户角色
     * @return 用户角色列表
     */
    List<UserRole> findAll();
    
    /**
     * 根据用户ID获取用户角色
     * @param userId 用户ID
     * @return 用户角色列表
     */
    List<UserRole> findByUserId(Long userId);
} 