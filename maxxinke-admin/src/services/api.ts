import axios, { AxiosRequestConfig } from 'axios';
import { message } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

console.log('API服务初始化, baseURL:', API_BASE_URL);

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // 缩短超时时间，提高响应速度
  headers: {
    'Content-Type': 'application/json',
  },
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
    return response;
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
export const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  try {
    // 处理分页参数，将page减1以匹配后端从0开始的分页
    if (config.params && typeof config.params.page === 'number') {
      config.params.page = config.params.page - 1;
    }
    const response = await api.request(config);
    console.log('请求URL:', config.url, '响应:', response);
    // 如果是文件上传请求，返回完整响应
    if (config.headers?.['Content-Type'] === 'multipart/form-data') {
      return response as T;
    }
    return response.data;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
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

// 产品相关API
export const productsAPI = {
  getProducts: (params: any) => request<ApiResponse<any>>({
    url: '/products',
    method: 'GET',
    params,
  }),
  getProduct: (id: string) => request<ApiResponse<any>>({
    url: `/products/${id}`,
    method: 'GET',
  }),
  createProduct: (data: FormData) => request<ApiResponse<any>>({
    url: '/products',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: [(data) => data],
  }),
  updateProduct: (id: string, data: FormData) => request<ApiResponse<any>>({
    url: `/products/${id}`,
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    transformRequest: [(data) => data],
  }),
  deleteProduct: (id: string) => request<ApiResponse<void>>({
    url: `/products/${id}`,
    method: 'DELETE',
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
  sort?: string;
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

export default api; 