package com.maxxinke.service;

import com.maxxinke.entity.AboutUs;
import com.maxxinke.repository.AboutUsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 关于我们服务类
 * 处理关于我们信息的业务逻辑
 */
@Service
public class AboutUsService {
    
    /**
     * 关于我们数据访问接口
     */
    @Autowired
    private AboutUsRepository aboutUsRepository;
    
    /**
     * 获取最新的关于我们信息
     * 
     * @return 最新的AboutUs记录，如果没有则返回null
     */
    public AboutUs getLatestAboutUs() {
        return aboutUsRepository.findFirstByOrderByCreateTimeDesc();
    }
    
    /**
     * 保存或更新关于我们信息
     * 
     * @param aboutUs 要保存的AboutUs对象
     * @return 保存后的AboutUs对象，包含数据库生成的ID和时间戳
     */
    public AboutUs saveAboutUs(AboutUs aboutUs) {
        return aboutUsRepository.save(aboutUs);
    }
} 