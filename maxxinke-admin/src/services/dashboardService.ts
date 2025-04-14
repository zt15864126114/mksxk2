import { request } from './api';

export interface DashboardStats {
  totalProducts: number;
  totalNews: number;
  totalMessages: number;
  totalViews: number;
  totalAllViews: number; // 总访问量
  productGrowth: number;
  newsGrowth: number;
  messageGrowth: number;
  viewsGrowth: number;
}

export interface VisitData {
  date: string;
  value: number;
}

export interface CategoryData {
  category: string;
  count: number;
}

export interface RecentMessage {
  id: number;
  title: string;
  status: string;
  time: string;
}

export interface RecentNews {
  id: number;
  title: string;
  type: string;
  time: string;
}

export const dashboardAPI = {
  // 获取统计数据
  getStats: () => 
    request<DashboardStats>({
      url: '/dashboard/stats',
      method: 'get',
    }),

  // 获取访问量数据
  getVisitData: () => 
    request<VisitData[]>({
      url: '/dashboard/visits',
      method: 'get',
    }),

  // 获取每日访问量数据
  getDailyVisitData: () => 
    request<VisitData[]>({
      url: '/dashboard/visits/daily',
      method: 'get',
    }),

  // 获取每年访问量数据
  getYearlyVisitData: () => 
    request<VisitData[]>({
      url: '/dashboard/visits/yearly',
      method: 'get',
    }),

  // 获取产品分类统计
  getCategoryData: () => 
    request<CategoryData[]>({
      url: '/dashboard/categories',
      method: 'get',
    }),

  // 获取最近消息
  getRecentMessages: () => 
    request<RecentMessage[]>({
      url: '/dashboard/recent-messages',
      method: 'get',
    }),

  // 获取最新新闻
  getRecentNews: () => 
    request<RecentNews[]>({
      url: '/dashboard/recent-news',
      method: 'get',
    }),
}; 