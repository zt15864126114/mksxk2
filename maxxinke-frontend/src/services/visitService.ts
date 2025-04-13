import api from './api';

export interface VisitStats {
  totalVisits: number;
  totalProducts: number;
  totalNews: number;
  totalMessages: number;
}

export interface VisitTrend {
  month: string;
  count: number;
}

export interface VisitData {
  date: string;
  value: number;
}

export interface CategoryData {
  category: string;
  count: number;
}

export const visitService = {
  // 获取访问统计数据
  getVisitStats: async (): Promise<VisitStats> => {
    const { data } = await api.get<VisitStats>('/dashboard/stats');
    return data;
  },

  // 获取访问趋势数据
  getVisitData: async (): Promise<VisitData[]> => {
    const { data } = await api.get<VisitData[]>('/dashboard/visits');
    return data;
  },

  // 获取产品分类统计数据
  getCategoryData: async (): Promise<CategoryData[]> => {
    const { data } = await api.get<CategoryData[]>('/dashboard/categories');
    return data;
  }
}; 