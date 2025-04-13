import { productsAPI } from './api';
import { PaginationParams, PaginatedResponse } from './api';

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  specification: string;
  application: string;
  image: string;
  sort: number;
  status: number;
  createTime: string;
  updateTime: string;
}

export const productService = {
  // 获取产品列表
  getProducts: async (params?: any): Promise<PaginatedResponse<Product>> => {
    try {
      const response = await productsAPI.getProducts(params);
      return response;
    } catch (error) {
      console.error('获取产品列表失败:', error);
      throw error;
    }
  },

  // 获取单个产品
  getProduct: async (id: string): Promise<Product> => {
    try {
      const response = await productsAPI.getProduct(id);
      return response;
    } catch (error) {
      console.error('获取产品详情失败:', error);
      throw error;
    }
  },

  // 创建产品
  createProduct: async (data: FormData): Promise<Product> => {
    try {
      const response = await productsAPI.createProduct(data);
      return response;
    } catch (error) {
      console.error('创建产品失败:', error);
      throw error;
    }
  },

  // 更新产品
  updateProduct: async (id: string, data: FormData): Promise<Product> => {
    try {
      const response = await productsAPI.updateProduct(id, data);
      return response;
    } catch (error) {
      console.error('更新产品失败:', error);
      throw error;
    }
  },

  // 删除产品
  deleteProduct: async (id: string): Promise<void> => {
    try {
      const response = await productsAPI.deleteProduct(id);
      return response;
    } catch (error) {
      console.error('删除产品失败:', error);
      throw error;
    }
  },
}; 