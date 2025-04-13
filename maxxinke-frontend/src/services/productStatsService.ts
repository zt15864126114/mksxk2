import api from './api';

export interface ProductStats {
  total: number;
  monthNew: number;
  totalViews: number;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface ProductTrend {
  month: string;
  count: number;
}

export const productStatsService = {
  // 获取产品统计概览
  getProductStats: async (): Promise<ProductStats> => {
    const response = await api.get<ProductStats>('/product-stats/overview');
    return response.data;
  },

  // 获取产品分类统计
  getCategoryStats: async (): Promise<CategoryStat[]> => {
    const response = await api.get<CategoryStat[]>('/product-stats/categories');
    return response.data;
  },

  // 获取产品新增趋势
  getProductTrends: async (): Promise<ProductTrend[]> => {
    const response = await api.get<ProductTrend[]>('/product-stats/trends');
    return response.data;
  },

  // 获取热门产品
  getHotProducts: async (limit: number = 10): Promise<any[]> => {
    const response = await api.get<any[]>(`/product-stats/hot?limit=${limit}`);
    return response.data;
  },

  // 增加产品访问量
  incrementViews: async (productId: number): Promise<void> => {
    await api.post(`/product-stats/${productId}/increment-views`);
  }
}; 