import api from './api';

export interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  status: number;
  createTime: string;
  updateTime: string;
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
}

export const productService = {
  // 获取产品列表
  getProducts: async (params: ProductListParams): Promise<ProductListResponse> => {
    const { data } = await api.get<ProductListResponse>('/products', {
      params
    });
    return data;
  },

  // 获取产品详情
  getProductById: async (id: number): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${id}`);
    return data;
  },

  // 获取产品分类
  getCategories: async (): Promise<string[]> => {
    const { data } = await api.get<string[]>('/products/categories');
    return data;
  },

  // 获取最新产品
  getRecentProducts: async (size: number = 3): Promise<Product[]> => {
    const { data } = await api.get<Product[]>('/products/recent', {
      params: { size }
    });
    return data;
  }
}; 