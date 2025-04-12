package com.maxxinke.service;

import com.maxxinke.entity.Admin;
import java.util.List;
import java.util.Optional;

/**
 * 管理员服务接口
 * 定义管理员相关的业务操作
 */
public interface AdminService {
    
    /**
     * 创建管理员
     * @param admin 管理员信息
     * @return 创建的管理员
     */
    Admin createAdmin(Admin admin);
    
    /**
     * 更新管理员信息
     * @param id 管理员ID
     * @param admin 管理员信息
     * @return 更新后的管理员
     */
    Admin updateAdmin(Long id, Admin admin);
    
    /**
     * 删除管理员
     * @param id 管理员ID
     */
    void deleteAdmin(Long id);
    
    /**
     * 获取所有管理员列表
     * @return 管理员列表
     */
    List<Admin> findAll();
    
    /**
     * 根据ID获取管理员
     * @param id 管理员ID
     * @return 管理员信息
     */
    Admin getAdminById(Long id);
    
    /**
     * 更新管理员密码
     * @param id 管理员ID
     * @param newPassword 新密码
     */
    void updatePassword(Long id, String newPassword);
    
    /**
     * 根据用户名获取管理员
     * @param username 管理员用户名
     * @return 管理员对象，如果不存在则返回空
     */
    Optional<Admin> getAdminByUsername(String username);
    
    /**
     * 检查用户名是否存在
     * @param username 要检查的用户名
     * @return 存在返回true，否则返回false
     */
    boolean existsByUsername(String username);
    
    /**
     * 验证密码是否正确
     * @param rawPassword 原始密码
     * @param encodedPassword 加密后的密码
     * @return 密码正确返回true，否则返回false
     */
    boolean validatePassword(String rawPassword, String encodedPassword);
    
    /**
     * 对密码进行加密
     * @param rawPassword 原始密码
     * @return 加密后的密码
     */
    String encodePassword(String rawPassword);
    
    /**
     * 获取当前登录的管理员
     * @return 当前管理员对象
     */
    Admin getCurrentAdmin();
} 