import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import { config } from '../config';

// 创建axios实例
const instance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    // console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  error => {
    // 对响应错误做点什么
    console.error('[API Response Error]', error);
    
    // 处理常见的HTTP错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message.error('未授权，请重新登录');
          // 可以在这里处理登出逻辑
          break;
        case 403:
          message.error('您没有权限执行此操作');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(`请求失败: ${error.message}`);
      }
    } else if (error.request) {
      message.error('网络异常，请检查您的网络连接');
    } else {
      message.error(`请求配置错误: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
);

// 导出请求方法
export const request = {
  get<T>(url: string, params?: any): Promise<T> {
    return instance.get<any>(url, { params })
      .then((response: AxiosResponse<T>) => response.data);
  },
  
  post<T>(url: string, data?: any): Promise<T> {
    return instance.post<any>(url, data)
      .then((response: AxiosResponse<T>) => response.data);
  },
  
  put<T>(url: string, data?: any): Promise<T> {
    return instance.put<any>(url, data)
      .then((response: AxiosResponse<T>) => response.data);
  },
  
  delete<T>(url: string, params?: any): Promise<T> {
    return instance.delete<any>(url, { params })
      .then((response: AxiosResponse<T>) => response.data);
  }
};

// 日志初始化信息
// console.log('[API] Request utility initialized with base URL:', config.apiBaseUrl);

export default request;