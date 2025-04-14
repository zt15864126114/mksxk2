package com.maxxinke.repository;

import com.maxxinke.entity.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 系统配置数据访问接口
 */
@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, Long> {
    
    /**
     * 根据配置键查找配置
     * @param configKey 配置键
     * @return 配置对象
     */
    Optional<SystemConfig> findByConfigKey(String configKey);
    
    /**
     * 删除指定键的配置
     * @param configKey 配置键
     */
    void deleteByConfigKey(String configKey);
    
    /**
     * 检查指定键的配置是否存在
     * @param configKey 配置键
     * @return 是否存在
     */
    boolean existsByConfigKey(String configKey);
} 