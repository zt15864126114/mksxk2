import api from './api';
import { AxiosResponse } from 'axios';

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  specifications: ProductSpecification[];
  application: string;
  createTime: string;
  updateTime: string;
  status: number;
}

export interface ProductListResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ProductListParams {
  page: number;
  pageSize: number;
  category?: string;
  status?: number;
  keyword?: string;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export const productService = {
  // 获取产品列表
  getProducts: async (params: ProductListParams): Promise<ProductListResponse> => {
    const adjustedParams = {
      ...params,
      page: params.page - 1,  // 将页码减1以适配Spring Boot的分页
      size: params.pageSize   // 使用pageSize作为size参数
    };
    const response = await api.get('/products', {
      params: adjustedParams
    });
    return response;
  },

  // 获取产品详情
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response;
  },

  // 获取产品分类统计
  getCategories: async (): Promise<CategoryStat[]> => {
    const response = await api.get('/product-stats/categories');
    return response;
  },

  // 获取热门产品
  getHotProducts: async (size: number = 3): Promise<Product[]> => {
    const response = await api.get('/product-stats/hot', {
      params: { limit: size }
    });
    return response;
  }
};