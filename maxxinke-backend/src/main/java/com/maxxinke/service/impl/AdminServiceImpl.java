package com.maxxinke.service.impl;

import com.maxxinke.entity.Admin;
import com.maxxinke.repository.AdminRepository;
import com.maxxinke.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 管理员服务实现类
 * 实现AdminService接口定义的所有业务方法
 */
@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 创建管理员
     * @param admin 管理员实体对象
     * @return 创建成功的管理员对象
     */
    @Override
    @Transactional
    public Admin createAdmin(Admin admin) {
        if (adminRepository.existsByUsername(admin.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return adminRepository.save(admin);
    }

    /**
     * 更新管理员信息
     * @param id 管理员ID
     * @param admin 管理员实体对象，必须包含有效的id
     * @return 更新后的管理员对象
     */
    @Override
    @Transactional
    public Admin updateAdmin(Long id, Admin admin) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin not found");
        }
        admin.setId(id);
        if (admin.getPassword() != null) {
            admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        }
        return adminRepository.save(admin);
    }

    /**
     * 更新管理员密码
     * @param id 管理员ID
     * @param newPassword 新密码
     */
    @Override
    @Transactional
    public void updatePassword(Long id, String newPassword) {
        Admin admin = adminRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found"));
        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);
    }

    /**
     * 删除管理员
     * @param id 管理员ID
     */
    @Override
    @Transactional
    public void deleteAdmin(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin not found");
        }
        adminRepository.deleteById(id);
    }

    /**
     * 根据ID获取管理员
     * @param id 管理员ID
     * @return 管理员对象，如果不存在则返回空
     */
    @Override
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    /**
     * 根据用户名获取管理员
     * @param username 管理员用户名
     * @return 管理员对象，如果不存在则返回空
     */
    @Override
    public Optional<Admin> getAdminByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    /**
     * 检查用户名是否存在
     * @param username 要检查的用户名
     * @return 存在返回true，否则返回false
     */
    @Override
    public boolean existsByUsername(String username) {
        return adminRepository.existsByUsername(username);
    }

    /**
     * 验证密码是否正确
     * @param rawPassword 原始密码
     * @param encodedPassword 加密后的密码
     * @return 密码正确返回true，否则返回false
     */
    @Override
    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    /**
     * 对密码进行加密
     * @param rawPassword 原始密码
     * @return 加密后的密码
     */
    @Override
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * 获取所有管理员
     * @return 管理员列表
     */
    @Override
    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    /**
     * 获取当前登录的管理员
     * @return 当前管理员对象
     */
    @Override
    public Admin getCurrentAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated admin found");
        }
        String username = authentication.getName();
        return adminRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }
} 