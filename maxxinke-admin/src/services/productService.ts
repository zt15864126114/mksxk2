import request from '@/utils/request';
import type { PaginationParams, PaginatedResponse } from './api';

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  specifications: ProductSpecification[] | string;
  application: string;
  image: string;
  sort: number;
  status: number;
  createTime: string;
  updateTime: string;
}

export interface ProductListParams {
  page?: number;
  pageSize?: number;
  category?: string;
  status?: number;
}

export interface ProductListResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  sort: number;
  status: number;
  createTime?: string;
}

export const productService = {
  // 获取产品列表
  getProducts: async (params?: ProductListParams) => {
    const adjustedParams = params ? {
      ...params,
      page: (params.page || 1) - 1, // 将页码减1以适配Spring Boot的分页
      size: params.pageSize
    } : undefined;
    
    const response = await request.get<ProductListResponse>('/products', { 
      params: adjustedParams
    });
    return response;
  },

  // 获取产品详情
  getProduct: async (id: string) => {
    const response = await request.get<Product>(`/products/${id}`);
    return response;
  },

  // 创建产品
  createProduct: async (formData: FormData) => {
    const response = await request.post<Product>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // 更新产品
  updateProduct: async (id: string, formData: FormData) => {
    const response = await request.put<Product>(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // 删除产品
  deleteProduct: async (id: string) => {
    await request.delete(`/products/${id}`);
  },

  // 更新产品排序
  updateSort: async (id: number, sort: number) => {
    const formData = new FormData();
    formData.append('sort', sort.toString());
    const response = await request.put<Product>(`/products/${id}/sort`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  },

  // 获取所有产品
  getAllProducts: async () => {
    const response = await request.get<Product[]>('/products/all');
    return response;
  },

  // 获取产品分类列表
  getCategories: async () => {
    const response = await request.get<ProductCategory[]>('/product/categories');
    return response;
  },

  // 获取分类详情
  getCategory: async (id: string) => {
    const response = await request.get<ProductCategory>(`/product/categories/${id}`);
    return response;
  },

  // 创建分类
  createCategory: async (category: Partial<ProductCategory>) => {
    const response = await request.post<ProductCategory>('/product/categories', category);
    return response;
  },

  // 更新分类
  updateCategory: async (id: string, category: Partial<ProductCategory>) => {
    const response = await request.put<ProductCategory>(`/product/categories/${id}`, category);
    return response;
  },

  // 删除分类
  deleteCategory: async (id: string) => {
    await request.delete(`/product/categories/${id}`);
  }
}; 