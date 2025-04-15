import api from './api';

export interface News {
  id: number;
  title: string;
  content: string;
  summary: string;
  image: string;
  type: string;
  createTime: string;
  updateTime: string;
  status: number;
  views: number;
}

export interface NewsListResponse {
  content: News[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface NewsListParams {
  page: number;
  pageSize: number;
  type?: string;
  status?: number;
  keyword?: string;
}

export const newsService = {
  // 获取新闻列表
  getNews: async (params: NewsListParams): Promise<NewsListResponse> => {
    const { page, pageSize, type, status, keyword } = params;
    
    // 创建调整后的参数对象
    const adjustedParams: Record<string, any> = {
      page: page - 1,  // 将页码减1以适配Spring Boot的分页
      size: pageSize   // 使用pageSize作为size参数
    };
    
    // 添加可选参数
    if (type) adjustedParams.type = type;
    if (status !== undefined) adjustedParams.status = status;
    
    // 如果有关键词，使用title参数进行标题搜索
    if (keyword) {
      adjustedParams.title = keyword; // 使用title参数进行标题搜索
      console.log('按标题搜索新闻:', keyword);
    }
    
    console.log('新闻搜索参数:', adjustedParams);
    
    try {
      const response = await api.get('/news', {
        params: adjustedParams
      });
      
      // 如果后端搜索不工作，尝试在前端进行过滤
      if (keyword && response && response.content && response.content.length > 0) {
        console.log('后端返回新闻数量:', response.content.length);
        
        // 检查结果中是否包含搜索词，如果不包含，则在前端进行过滤
        const titleMatches = response.content.filter(
          (news: News) => news.title.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (titleMatches.length < response.content.length) {
          console.log('在前端执行标题过滤，找到匹配新闻:', titleMatches.length);
          
          // 创建新的响应对象
          const filteredResponse = {
            ...response,
            content: titleMatches,
            totalElements: titleMatches.length
          };
          
          return filteredResponse;
        }
      }
      
      return response;
    } catch (error) {
      console.error('获取新闻列表失败:', error);
      throw error;
    }
  },

  // 获取新闻详情
  getNewsById: async (id: number): Promise<News> => {
    try {
      // 先记录浏览量，但不等待它完成
      newsService.incrementNewsViews(id).catch(err => 
        console.error('记录新闻浏览量失败:', err)
      );
      
      // 获取新闻详情
      const response = await api.get<News>(`/news/${id}`);
      return response;
    } catch (error) {
      console.error(`获取新闻 ID:${id} 详情失败:`, error);
      throw error;
    }
  },

  // 获取新闻类型
  getNewsTypes: async (): Promise<string[]> => {
    try {
      // 直接从新闻列表中提取类型
      console.log('从新闻列表中提取新闻类型...');
      const response = await api.get<NewsListResponse>('/news', { 
        params: { 
          page: 0, 
          size: 100,
          status: 1 // 只获取已发布的新闻
        } 
      });
      
      // 从新闻列表中提取类型
      if (response && response.content && response.content.length > 0) {
        const types = new Set<string>();
        response.content.forEach((news: News) => {
          if (news.type) types.add(news.type);
        });
        
        const typeArray = Array.from(types);
        console.log('成功从新闻列表提取类型:', typeArray);
        return typeArray;
      } else {
        console.warn('新闻列表为空，无法提取类型');
        return ['公司新闻', '行业动态', '技术分享'];
      }
    } catch (error) {
      console.error('获取新闻类型失败', error);
      // 如果出错，返回默认值以防止页面崩溃
      return ['公司新闻', '行业动态', '技术分享'];
    }
  },

  // 获取最新新闻
  getRecentNews: async (size: number = 3): Promise<News[]> => {
    const response = await api.get<News[]>('/news/recent', {
      params: { size }
    });
    return response;
  },

  // 创建新闻
  createNews: async (news: Partial<News>) => {
    const { data } = await api.post('/news', news);
    return data;
  },

  // 更新新闻
  updateNews: async (id: number, news: Partial<News>) => {
    const { data } = await api.put(`/news/${id}`, news);
    return data;
  },

  // 删除新闻
  deleteNews: async (id: number) => {
    const { data } = await api.delete(`/news/${id}`);
    return data;
  },

  // 增加新闻浏览量
  incrementNewsViews: async (id: number): Promise<void> => {
    try {
      await api.post(`/news/${id}/view`);
      console.log(`新闻 ID:${id} 浏览量+1`);
    } catch (error) {
      console.error('增加新闻浏览量失败:', error);
      // 静默失败，不影响用户体验
    }
  }
}; 