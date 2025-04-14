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
}

export const newsService = {
  // 获取新闻列表
  getNews: async (params: NewsListParams): Promise<NewsListResponse> => {
    const adjustedParams = {
      ...params,
      page: params.page - 1,  // 将页码减1以适配Spring Boot的分页
      size: params.pageSize   // 使用pageSize作为size参数
    };
    const response = await api.get('/news', {
      params: adjustedParams
    });
    return response;
  },

  // 获取新闻详情
  getNewsById: async (id: number): Promise<News> => {
    const response = await api.get<News>(`/news/${id}`);
    return response;
  },

  // 获取新闻类型
  getNewsTypes: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/news/types');
    return response;
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
  }
}; 