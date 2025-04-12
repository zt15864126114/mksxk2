package com.maxxinke.service;

import com.maxxinke.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

/**
 * 新闻服务接口
 * 定义新闻相关的业务操作，包括新闻的CRUD操作和按状态、类型查询等功能
 */
public interface NewsService {
    /**
     * 创建新闻
     * @param news 新闻实体对象
     * @return 创建成功的新闻对象
     */
    News createNews(News news);
    
    /**
     * 更新新闻
     * @param news 新闻实体对象
     * @return 更新后的新闻对象
     */
    News updateNews(News news);
    
    /**
     * 删除新闻
     * @param id 新闻ID
     */
    void deleteNews(Long id);
    
    /**
     * 根据ID获取新闻
     * @param id 新闻ID
     * @return 新闻对象
     */
    News getNewsById(Long id);
    
    /**
     * 根据状态和类型分页获取新闻
     * @param status 新闻状态
     * @param type 新闻类型
     * @param pageable 分页参数
     * @return 新闻分页对象
     */
    Page<News> getNewsByStatusAndType(Integer status, String type, Pageable pageable);
    
    /**
     * 根据状态和类型获取新闻列表
     * @param status 新闻状态
     * @param type 新闻类型
     * @return 新闻列表
     */
    List<News> getNewsByStatusAndType(Integer status, String type);
    
    /**
     * 根据状态分页获取新闻
     * @param status 新闻状态
     * @param pageable 分页参数
     * @return 新闻分页对象
     */
    Page<News> getNewsByStatus(Integer status, Pageable pageable);
    
    /**
     * 根据状态获取新闻列表
     * @param status 新闻状态
     * @return 新闻列表
     */
    List<News> getNewsByStatus(Integer status);

    /**
     * 获取所有新闻
     * @return 所有新闻列表
     */
    List<News> findAll();

    /**
     * 分页获取所有新闻
     * @param pageable 分页参数
     * @return 新闻分页列表
     */
    Page<News> findAll(Pageable pageable);

    /**
     * 根据类型获取新闻
     * @param type 新闻类型
     * @return 类型对应的新闻列表
     */
    List<News> findByType(String type);

    /**
     * 根据状态获取新闻
     * @param status 新闻状态
     * @return 状态对应的新闻列表
     */
    List<News> findByStatus(Integer status);

    /**
     * 获取所有新闻
     * @return 所有新闻列表
     */
    List<News> getAllNews();

    /**
     * 根据类型获取新闻
     * @param type 新闻类型
     * @return 类型对应的新闻列表
     */
    List<News> getNewsByType(String type);
} 