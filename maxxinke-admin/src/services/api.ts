import axios, { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import type { Product, ProductListParams, ProductSpecification } from './productService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

console.log('API服务初始化, baseURL:', API_BASE_URL);

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log(`发送请求: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('请求配置:', {
      headers: config.headers,
      data: config.data,
    });
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log(`请求成功: ${response.config.url}`, response.status);
    return response.data;
  },
  (error) => {
    console.error('请求失败:', error);
    
    // 处理超时错误
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.error('请求超时');
      message.error('服务器响应超时，请稍后再试');
      return Promise.reject(new Error('请求超时'));
    }
    
    // 处理网络错误
    if (!error.response) {
      console.error('网络错误或服务器未响应');
      message.error('网络错误或服务器未响应');
      return Promise.reject(new Error('网络错误'));
    }
    
    const { response } = error;
    // 处理常见错误
    if (response) {
      if (response.status === 401) {
        message.error('登录已过期，请重新登录');
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (response.status === 403) {
        message.error('没有权限访问此资源');
      } else if (response.status === 500) {
        message.error('服务器错误，请稍后再试');
      } else {
        message.error(response.data?.message || '请求发生错误');
      }
    }
    
    return Promise.reject(error);
  }
);

// 包装API调用，增加错误处理
const callApi = async <T>(apiFunc: () => Promise<T>, fallback: T | null = null): Promise<T> => {
  try {
    return await apiFunc();
  } catch (error) {
    console.error('API调用失败:', error);
    if (fallback !== null) {
      console.log('使用备用数据', fallback);
      return fallback as T;
    }
    throw error;
  }
};

// 封装通用请求方法
export const request = <T>(config: AxiosRequestConfig): Promise<T> => {
  return api.request(config);
};

// 用户相关API
export const authAPI = {
  login: (data: { username: string; password: string }) => 
    request<{ token: string }>({
      url: '/auth/login',
      method: 'post',
      data,
    }),
};

// 管理员相关API
export const adminAPI = {
  getCurrentAdmin: () => 
    request<any>({
      url: '/admins/me',
      method: 'GET',
    }),
    
  validatePassword: (adminId: number, password: string) =>
    request<void>({
      url: `/admins/${adminId}/validate-password`,
      method: 'POST',
      data: password,
      headers: {
        'Content-Type': 'text/plain',
      },
    }),
    
  updatePassword: (adminId: number, newPassword: string) => 
    request<void>({
      url: `/admins/${adminId}/password`,
      method: 'PUT',
      data: newPassword,
      headers: {
        'Content-Type': 'text/plain',
      },
    }),
};

// 产品相关API
export const productsAPI = {
  getProducts: (params: ProductListParams) => 
    request<PaginatedResponse<Product>>({
      url: '/products',
      method: 'GET',
      params,
    }),

  getProduct: (id: number) => 
    request<Product>({
      url: `/products/${id}`,
      method: 'GET',
    }),

  createProduct: (data: FormData) => 
    request<Product>({
      url: '/products',
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [(data) => data],
    }),

  updateProduct: (id: number, data: FormData) => 
    request<Product>({
      url: `/products/${id}`,
      method: 'POST',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [(data) => data],
    }),

  deleteProduct: (id: number) => 
    request<void>({
      url: `/products/${id}`,
      method: 'DELETE',
    }),

  updateSort: (id: number, sort: number) => 
    request<Product>({
      url: `/products/${id}/sort`,
      method: 'PUT',
      data: { sort },
    }),

  getAllProducts: () => 
    request<Product[]>({
      url: '/products/all',
      method: 'GET',
    }),
};

// 新闻相关API
export const newsAPI = {
  getNewsList: (params?: any) => 
    request<PaginatedResponse<any>>({
      url: '/news',
      method: 'get',
      params,
    }),

  getNewsItem: (id: string) => 
    request<any>({
      url: `/news/${id}`,
      method: 'get',
    }),

  createNewsItem: (data: FormData) => 
    request<any>({
      url: '/news',
      method: 'post',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [(data) => data],
    }),

  updateNewsItem: (id: string, data: FormData) => 
    request<any>({
      url: `/news/${id}`,
      method: 'post',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: [(data) => data],
    }),

  deleteNewsItem: (id: string) => 
    request<void>({
      url: `/news/${id}`,
      method: 'delete',
    }),
};

// 消息相关API
export const messagesAPI = {
  getMessages: (params?: any) => 
    request<any>({
      url: '/messages',
      method: 'get',
      params,
    }),

  getMessage: (id: string) => 
    request<any>({
      url: `/messages/${id}`,
      method: 'get',
    }),

  updateMessageStatus: (id: string, status: string) => 
    request<any>({
      url: `/messages/${id}/status?status=${status}`,
      method: 'put',
    }),

  replyMessage: (id: string, reply: string) =>
    request<any>({
      url: `/messages/${id}/reply`,
      method: 'put',
      data: { reply },
    }),

  deleteMessage: (id: string) => 
    request<void>({
      url: `/messages/${id}`,
      method: 'delete',
    }),
};

// Common types
export interface PaginationParams {
  page: number;
  size: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export default request; 