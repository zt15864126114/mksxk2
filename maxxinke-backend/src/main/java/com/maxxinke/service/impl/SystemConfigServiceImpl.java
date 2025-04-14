package com.maxxinke.service.impl;

import com.maxxinke.entity.SystemConfig;
import com.maxxinke.repository.SystemConfigRepository;
import com.maxxinke.service.SystemConfigService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 系统配置服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SystemConfigServiceImpl implements SystemConfigService {
    
    private final SystemConfigRepository systemConfigRepository;
    
    // 联系方式相关的配置键
    private static final String CONTACT_TEL = "contact_tel";
    private static final String CONTACT_MOBILE = "contact_mobile";
    private static final String CONTACT_EMAIL = "contact_email";
    private static final String CONTACT_SERVICE = "contact_service_email";
    private static final String CONTACT_ADDRESS = "contact_address";
    private static final String CONTACT_POSTCODE = "contact_postcode";
    private static final String CONTACT_WEBSITE = "contact_website";
    private static final String CONTACT_WECHAT = "contact_wechat";
    
    @Override
    @Transactional
    public SystemConfig saveConfig(String key, String value, String description) {
        // 查找是否已存在该配置
        Optional<SystemConfig> existingConfig = systemConfigRepository.findByConfigKey(key);
        SystemConfig config;
        
        if (existingConfig.isPresent()) {
            // 更新已有配置
            config = existingConfig.get();
            config.setConfigValue(value);
            if (description != null) {
                config.setDescription(description);
            }
        } else {
            // 创建新配置
            config = new SystemConfig();
            config.setConfigKey(key);
            config.setConfigValue(value);
            config.setDescription(description);
        }
        
        return systemConfigRepository.save(config);
    }
    
    @Override
    @Transactional
    public int saveConfigs(Map<String, String> configs) {
        int count = 0;
        for (Map.Entry<String, String> entry : configs.entrySet()) {
            saveConfig(entry.getKey(), entry.getValue(), null);
            count++;
        }
        return count;
    }
    
    @Override
    public String getConfigValue(String key) {
        Optional<SystemConfig> config = systemConfigRepository.findByConfigKey(key);
        return config.map(SystemConfig::getConfigValue).orElse(null);
    }
    
    @Override
    public String getConfigValue(String key, String defaultValue) {
        String value = getConfigValue(key);
        return value != null ? value : defaultValue;
    }
    
    @Override
    public List<SystemConfig> getAllConfigs() {
        return systemConfigRepository.findAll();
    }
    
    @Override
    @Transactional
    public void deleteConfig(String key) {
        systemConfigRepository.deleteByConfigKey(key);
    }
    
    @Override
    public Map<String, String> getContactInfo() {
        Map<String, String> contactInfo = new HashMap<>();
        contactInfo.put("tel", getConfigValue(CONTACT_TEL, ""));
        contactInfo.put("mobile", getConfigValue(CONTACT_MOBILE, ""));
        contactInfo.put("email", getConfigValue(CONTACT_EMAIL, ""));
        contactInfo.put("serviceEmail", getConfigValue(CONTACT_SERVICE, ""));
        contactInfo.put("address", getConfigValue(CONTACT_ADDRESS, ""));
        contactInfo.put("postcode", getConfigValue(CONTACT_POSTCODE, ""));
        contactInfo.put("website", getConfigValue(CONTACT_WEBSITE, ""));
        contactInfo.put("wechat", getConfigValue(CONTACT_WECHAT, ""));
        return contactInfo;
    }
    
    @Override
    @Transactional
    public int saveContactInfo(Map<String, String> contactInfo) {
        Map<String, String> configs = new HashMap<>();
        
        if (contactInfo.containsKey("tel")) {
            configs.put(CONTACT_TEL, contactInfo.get("tel"));
        }
        if (contactInfo.containsKey("mobile")) {
            configs.put(CONTACT_MOBILE, contactInfo.get("mobile"));
        }
        if (contactInfo.containsKey("email")) {
            configs.put(CONTACT_EMAIL, contactInfo.get("email"));
        }
        if (contactInfo.containsKey("serviceEmail")) {
            configs.put(CONTACT_SERVICE, contactInfo.get("serviceEmail"));
        }
        if (contactInfo.containsKey("address")) {
            configs.put(CONTACT_ADDRESS, contactInfo.get("address"));
        }
        if (contactInfo.containsKey("postcode")) {
            configs.put(CONTACT_POSTCODE, contactInfo.get("postcode"));
        }
        if (contactInfo.containsKey("website")) {
            configs.put(CONTACT_WEBSITE, contactInfo.get("website"));
        }
        if (contactInfo.containsKey("wechat")) {
            configs.put(CONTACT_WECHAT, contactInfo.get("wechat"));
        }
        
        return saveConfigs(configs);
    }
} 