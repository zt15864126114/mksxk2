import axios, { AxiosRequestConfig } from 'axios';
import { config } from '../config';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 打印配置信息，方便调试
console.log('API 配置信息:', {
  baseURL: config.apiBaseUrl,
  apiConfigSource: process.env.REACT_APP_API_BASE_URL ? 'Environment Variable' : 'Default Value'
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any request processing here (e.g., adding tokens)
    console.log('发送请求:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      completeURL: `${config.baseURL}${config.url}`
    });
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Extract data from response
    console.log('请求成功:', {
      url: response.config.url,
      status: response.status,
      dataSize: JSON.stringify(response.data).length
    });
    return response.data;
  },
  (error) => {
    // Handle error responses
    console.error('请求出错:', {
      url: error.config?.url,
      message: error.message,
      response: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Request methods
export const request = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.get(url, config).then(response => response as T);
  },

  post: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.post(url, data, config).then(response => response as T);
  },

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.put(url, data, config).then(response => response as T);
  },

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return axiosInstance.delete(url, config).then(response => response as T);
  },
}; 