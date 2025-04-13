import api from './api';

export interface News {
  id: number;
  title: string;
  content: string;
  type: string;
  createTime: string;
  views: number;
  image?: string;
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
  getNewsList: async (params: any) => {
    const { data } = await api.get('/news', { params });
    return data;
  },

  // 获取新闻详情
  getNewsById: async (id: number): Promise<News> => {
    const { data } = await api.get(`/news/${id}`);
    return data;
  },

  // 获取新闻类型
  getNewsTypes: async (): Promise<string[]> => {
    const { data } = await api.get<string[]>('/news/types');
    return data;
  },

  // 获取最新新闻
  getRecentNews: async (size: number = 3): Promise<News[]> => {
    const { data } = await api.get<News[]>('/news/recent', {
      params: { size }
    });
    return data;
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