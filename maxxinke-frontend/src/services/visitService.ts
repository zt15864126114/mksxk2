import api from './api';

export interface VisitStats {
  totalVisits: number;
  todayVisits: number;
  weekVisits: number;
  monthVisits: number;
}

export interface VisitData {
  date: string;
  count: number;
}

export interface CategoryData {
  category: string;
  count: number;
}

export const visitService = {
  // 获取访问统计数据
  getVisitStats: async (): Promise<VisitStats> => {
    const response = await api.get<VisitStats>('/dashboard/stats');
    return response;
  },

  // 获取访问趋势数据
  getVisitData: async (): Promise<VisitData[]> => {
    const response = await api.get<VisitData[]>('/dashboard/visits');
    return response;
  },

  // 获取产品分类统计数据
  getCategoryData: async (): Promise<CategoryData[]> => {
    const response = await api.get<CategoryData[]>('/dashboard/categories');
    return response;
  }
}; 