package com.maxxinke.repository;

import com.maxxinke.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * 用户角色数据访问接口
 * 继承JpaRepository，提供基本的CRUD操作
 */
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    
    /**
     * 根据用户ID查找用户角色
     * @param userId 用户ID
     * @return 用户角色列表
     */
    List<UserRole> findByUserId(Long userId);
} 