package com.maxxinke.service;

import com.maxxinke.entity.SystemConfig;
import java.util.List;
import java.util.Map;

/**
 * 系统配置服务接口
 */
public interface SystemConfigService {
    
    /**
     * 保存配置
     * @param key 配置键
     * @param value 配置值
     * @param description 配置描述
     * @return 配置对象
     */
    SystemConfig saveConfig(String key, String value, String description);
    
    /**
     * 批量保存配置
     * @param configs 配置Map，key为配置键，value为配置值
     * @return 保存的配置数量
     */
    int saveConfigs(Map<String, String> configs);
    
    /**
     * 获取配置值
     * @param key 配置键
     * @return 配置值
     */
    String getConfigValue(String key);
    
    /**
     * 获取配置值，如果不存在则返回默认值
     * @param key 配置键
     * @param defaultValue 默认值
     * @return 配置值
     */
    String getConfigValue(String key, String defaultValue);
    
    /**
     * 获取所有配置
     * @return 配置列表
     */
    List<SystemConfig> getAllConfigs();
    
    /**
     * 删除配置
     * @param key 配置键
     */
    void deleteConfig(String key);
    
    /**
     * 获取联系方式配置
     * @return 联系方式配置Map
     */
    Map<String, String> getContactInfo();
    
    /**
     * 保存联系方式配置
     * @param contactInfo 联系方式配置Map
     * @return 保存的配置数量
     */
    int saveContactInfo(Map<String, String> contactInfo);
} 