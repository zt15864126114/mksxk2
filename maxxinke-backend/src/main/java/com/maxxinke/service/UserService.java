package com.maxxinke.service;

import com.maxxinke.entity.User;
import java.util.List;

/**
 * 用户服务接口
 * 定义用户相关的业务操作，包括用户的CRUD操作和查询功能
 */
public interface UserService {
    
    /**
     * 创建新用户
     * @param user 用户实体对象
     * @return 创建成功的用户对象
     */
    User createUser(User user);
    
    /**
     * 更新用户信息
     * @param user 用户实体对象
     * @return 更新后的用户对象
     */
    User updateUser(User user);
    
    /**
     * 删除用户
     * @param id 用户ID
     */
    void deleteUser(Long id);
    
    /**
     * 根据ID获取用户
     * @param id 用户ID
     * @return 用户对象
     */
    User getUserById(Long id);
    
    /**
     * 获取所有用户列表
     * @return 用户列表
     */
    List<User> getAllUsers();
    
    /**
     * 检查用户名是否存在
     * @param username 用户名
     * @return 存在返回true，否则返回false
     */
    boolean existsByUsername(String username);
    
    /**
     * 检查邮箱是否存在
     * @param email 邮箱地址
     * @return 存在返回true，否则返回false
     */
    boolean existsByEmail(String email);
    
    /**
     * 根据用户名获取用户
     * @param username 用户名
     * @return 用户对象
     */
    User getUserByUsername(String username);
} 