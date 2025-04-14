package com.maxxinke.repository;

import com.maxxinke.entity.AboutUs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 关于我们数据访问接口
 * 继承自JpaRepository，提供基本的CRUD操作
 */
@Repository
public interface AboutUsRepository extends JpaRepository<AboutUs, Long> {
    
    /**
     * 获取最新的关于我们信息
     * 按照创建时间降序排序，返回第一条记录
     * 
     * @return 最新的AboutUs记录，如果没有则返回null
     */
    AboutUs findFirstByOrderByCreateTimeDesc();
} 