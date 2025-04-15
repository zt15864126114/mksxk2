package com.maxxinke.service.impl;

import com.maxxinke.entity.News;
import com.maxxinke.exception.BusinessException;
import com.maxxinke.repository.NewsRepository;
import com.maxxinke.service.NewsService;
import com.maxxinke.utils.OssUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 新闻服务实现类
 * 实现NewsService接口定义的所有业务方法，包括新闻的CRUD操作和按状态、类型查询等功能
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NewsServiceImpl implements NewsService {

    private final NewsRepository newsRepository;
    private final OssUtil ossUtil;

    /**
     * 创建新闻
     * @param news 新闻实体对象，包含新闻的标题、内容、状态等信息
     * @return 创建成功的新闻对象
     */
    @Override
    @Transactional
    public News createNews(News news) {
        try {
            log.info("开始创建新闻: {}", news.getTitle());
            News savedNews = newsRepository.save(news);
            log.info("新闻创建成功: {}", savedNews.getId());
            return savedNews;
        } catch (Exception e) {
            log.error("创建新闻失败: {}, 错误: {}", news.getTitle(), e.getMessage());
            throw new BusinessException("创建新闻失败: " + e.getMessage());
        }
    }

    /**
     * 更新新闻
     * @param news 新闻实体对象，包含要更新的新闻信息
     * @return 更新后的新闻对象
     * @throws RuntimeException 当新闻不存在时抛出异常
     */
    @Override
    @Transactional
    public News updateNews(News news) {
        try {
            log.info("开始更新新闻: {}", news.getId());
            if (!newsRepository.existsById(news.getId())) {
                throw new BusinessException("新闻不存在，ID: " + news.getId());
            }
            News updatedNews = newsRepository.save(news);
            log.info("新闻更新成功: {}", updatedNews.getId());
            return updatedNews;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("更新新闻失败: {}, 错误: {}", news.getId(), e.getMessage());
            throw new BusinessException("更新新闻失败: " + e.getMessage());
        }
    }

    /**
     * 删除新闻
     * @param id 要删除的新闻ID
     * @throws RuntimeException 当新闻不存在时抛出异常
     */
    @Override
    @Transactional
    public void deleteNews(Long id) {
        try {
            log.info("开始删除新闻: {}", id);
            News news = newsRepository.findById(id)
                    .orElseThrow(() -> new BusinessException("新闻不存在，ID: " + id));

            // 删除OSS上的图片
            String imageUrl = news.getImage();
            if (imageUrl != null && !imageUrl.isEmpty()) {
                log.info("开始删除新闻图片: {}", imageUrl);
                try {
                    ossUtil.deleteFile(imageUrl);
                    log.info("成功删除新闻图片: {}", imageUrl);
                } catch (Exception e) {
                    log.error("删除新闻图片失败: {}, 错误: {}", imageUrl, e.getMessage());
                    // 继续删除新闻，但记录错误
                }
            }

            // 删除新闻
            newsRepository.deleteById(id);
            log.info("成功删除新闻: {}", id);
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("删除新闻失败: {}, 错误: {}", id, e.getMessage());
            throw new BusinessException("删除新闻失败: " + e.getMessage());
        }
    }

    /**
     * 根据ID获取新闻
     * @param id 新闻ID
     * @return 新闻对象
     * @throws RuntimeException 当新闻不存在时抛出异常
     */
    @Override
    public News getNewsById(Long id) {
        try {
            log.debug("获取新闻信息: {}", id);
            return newsRepository.findById(id)
                    .orElseThrow(() -> new BusinessException("新闻不存在，ID: " + id));
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("获取新闻失败: {}, 错误: {}", id, e.getMessage());
            throw new BusinessException("获取新闻失败: " + e.getMessage());
        }
    }

    /**
     * 根据状态和类型分页获取新闻
     * @param status 新闻状态
     * @param type 新闻类型
     * @param pageable 分页参数，包含页码、每页大小等信息
     * @return 新闻分页对象，包含新闻列表和分页信息
     */
    @Override
    public Page<News> getNewsByStatusAndType(Integer status, String type, Pageable pageable) {
        try {
            log.debug("获取新闻列表，状态: {}, 类型: {}", status, type);
            return newsRepository.findByStatusAndTypeOrderByCreateTimeDesc(status, type, pageable);
        } catch (Exception e) {
            log.error("获取新闻列表失败，状态: {}, 类型: {}, 错误: {}", status, type, e.getMessage());
            throw new BusinessException("获取新闻列表失败: " + e.getMessage());
        }
    }

    /**
     * 根据状态和类型获取新闻列表
     * @param status 新闻状态
     * @param type 新闻类型
     * @return 新闻列表，按创建时间降序排列
     */
    @Override
    public List<News> getNewsByStatusAndType(Integer status, String type) {
        try {
            log.debug("获取新闻列表，状态: {}, 类型: {}", status, type);
            return newsRepository.findByStatusAndTypeOrderByCreateTimeDesc(status, type);
        } catch (Exception e) {
            log.error("获取新闻列表失败，状态: {}, 类型: {}, 错误: {}", status, type, e.getMessage());
            throw new BusinessException("获取新闻列表失败: " + e.getMessage());
        }
    }

    /**
     * 根据状态分页获取新闻
     * @param status 新闻状态
     * @param pageable 分页参数，包含页码、每页大小等信息
     * @return 新闻分页对象，包含新闻列表和分页信息
     */
    @Override
    public Page<News> getNewsByStatus(Integer status, Pageable pageable) {
        try {
            log.debug("获取新闻列表，状态: {}", status);
            return newsRepository.findByStatusOrderByCreateTimeDesc(status, pageable);
        } catch (Exception e) {
            log.error("获取新闻列表失败，状态: {}, 错误: {}", status, e.getMessage());
            throw new BusinessException("获取新闻列表失败: " + e.getMessage());
        }
    }

    /**
     * 根据状态获取新闻列表
     * @param status 新闻状态
     * @return 新闻列表，按创建时间降序排列
     */
    @Override
    public List<News> getNewsByStatus(Integer status) {
        try {
            log.debug("获取新闻列表，状态: {}", status);
            return newsRepository.findByStatusOrderByCreateTimeDesc(status);
        } catch (Exception e) {
            log.error("获取新闻列表失败，状态: {}, 错误: {}", status, e.getMessage());
            throw new BusinessException("获取新闻列表失败: " + e.getMessage());
        }
    }

    @Override
    public List<News> findAll() {
        try {
            log.debug("获取所有新闻");
            return newsRepository.findAll();
        } catch (Exception e) {
            log.error("获取所有新闻失败，错误: {}", e.getMessage());
            throw new BusinessException("获取所有新闻失败: " + e.getMessage());
        }
    }

    @Override
    public List<News> findByStatus(Integer status) {
        try {
            log.debug("获取新闻列表，状态: {}", status);
            return newsRepository.findByStatusOrderByCreateTimeDesc(status);
        } catch (Exception e) {
            log.error("获取新闻列表失败，状态: {}, 错误: {}", status, e.getMessage());
            throw new BusinessException("获取新闻列表失败: " + e.getMessage());
        }
    }

    @Override
    public List<News> findByType(String type) {
        try {
            log.debug("获取新闻列表，类型: {}", type);
            return newsRepository.findByType(type);
        } catch (Exception e) {
            log.error("获取新闻列表失败，类型: {}, 错误: {}", type, e.getMessage());
            throw new BusinessException("获取新闻列表失败: " + e.getMessage());
        }
    }

    @Override
    public List<News> getAllNews() {
        try {
            log.debug("获取所有新闻");
            return newsRepository.findAll();
        } catch (Exception e) {
            log.error("获取所有新闻失败，错误: {}", e.getMessage());
            throw new BusinessException("获取所有新闻失败: " + e.getMessage());
        }
    }

    @Override
    public List<News> getNewsByType(String type) {
        try {
            log.debug("获取新闻列表，类型: {}", type);
            return newsRepository.findByType(type);
        } catch (Exception e) {
            log.error("获取新闻列表失败，类型: {}, 错误: {}", type, e.getMessage());
            throw new BusinessException("获取新闻列表失败: " + e.getMessage());
        }
    }

    @Override
    public Page<News> findAll(Pageable pageable) {
        try {
            log.debug("分页获取所有新闻");
            return newsRepository.findAll(pageable);
        } catch (Exception e) {
            log.error("分页获取所有新闻失败，错误: {}", e.getMessage());
            throw new BusinessException("分页获取所有新闻失败: " + e.getMessage());
        }
    }

    /**
     * 增加新闻浏览量
     * @param id 新闻ID
     * @return 更新后的新闻对象
     */
    @Override
    @Transactional
    public News incrementViews(Long id) {
        try {
            log.info("增加新闻浏览量: {}", id);
            News news = newsRepository.findById(id)
                    .orElseThrow(() -> new BusinessException("新闻不存在，ID: " + id));
            
            // 增加浏览量
            news.setViews(news.getViews() + 1);
            News updatedNews = newsRepository.save(news);
            log.debug("新闻浏览量增加成功，ID: {}, 当前浏览量: {}", id, updatedNews.getViews());
            
            return updatedNews;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("增加新闻浏览量失败: {}, 错误: {}", id, e.getMessage());
            throw new BusinessException("增加新闻浏览量失败: " + e.getMessage());
        }
    }
}