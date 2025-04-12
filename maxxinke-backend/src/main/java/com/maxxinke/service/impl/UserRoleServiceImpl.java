package com.maxxinke.service.impl;

import com.maxxinke.entity.UserRole;
import com.maxxinke.repository.UserRoleRepository;
import com.maxxinke.service.UserRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 用户角色服务实现类
 * 实现UserRoleService接口定义的所有业务方法
 */
@Service
public class UserRoleServiceImpl implements UserRoleService {

    @Autowired
    private UserRoleRepository userRoleRepository;

    /**
     * 创建用户角色
     * @param userRole 用户角色实体对象
     * @return 创建成功的用户角色对象
     */
    @Override
    @Transactional
    public UserRole createUserRole(UserRole userRole) {
        return userRoleRepository.save(userRole);
    }

    /**
     * 更新用户角色
     * @param id 用户角色ID
     * @param userRole 用户角色实体对象
     * @return 更新后的用户角色对象
     */
    @Override
    @Transactional
    public UserRole updateUserRole(Long id, UserRole userRole) {
        if (!userRoleRepository.existsById(id)) {
            throw new RuntimeException("UserRole not found");
        }
        userRole.setId(id);
        return userRoleRepository.save(userRole);
    }

    /**
     * 删除用户角色
     * @param id 用户角色ID
     */
    @Override
    @Transactional
    public void deleteUserRole(Long id) {
        if (!userRoleRepository.existsById(id)) {
            throw new RuntimeException("UserRole not found");
        }
        userRoleRepository.deleteById(id);
    }

    /**
     * 获取所有用户角色
     * @return 用户角色列表
     */
    @Override
    public List<UserRole> findAll() {
        return userRoleRepository.findAll();
    }

    /**
     * 根据用户ID获取用户角色
     * @param userId 用户ID
     * @return 用户角色列表
     */
    @Override
    public List<UserRole> findByUserId(Long userId) {
        return userRoleRepository.findByUserId(userId);
    }
} 