import axios from 'axios';
import { message } from 'antd';

declare module 'axios' {
  export interface AxiosInstance {
    get<T = any>(url: string, config?: any): Promise<T>;
    post<T = any>(url: string, data?: any, config?: any): Promise<T>;
    put<T = any>(url: string, data?: any, config?: any): Promise<T>;
    delete<T = any>(url: string, config?: any): Promise<T>;
  }
}

// 创建自定义的axios实例，直接返回response.data
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://47.104.65.146:3002/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 获取认证token
    const token = localStorage.getItem('token');

    // 如果有token，添加到请求头中
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 对于前台不需要认证的请求，添加一个特殊的header
    if (!config.headers['Authorization']) {
      config.headers['X-Frontend-Request'] = 'true';
    }
    
    // console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    // console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, 'Status:', response.status);
    return response.data;
  },
  (error) => {
    // 统一错误处理
    console.error('API Error:', error.config?.url, error.message);
    
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || '请求失败';
      
      switch (statusCode) {
        case 401:
          message.error('未授权，请登录后重试');
          // 可以在这里处理登出逻辑或跳转到登录页
          break;
        case 403:
          message.error('没有访问权限');
          console.warn('Access forbidden. Make sure backend CORS settings allow this origin and check if authentication is required.');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误，请稍后重试');
          break;
        default:
          message.error(`请求错误 (${statusCode}): ${errorMessage}`);
          break;
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      message.error('无法连接到服务器，请检查网络连接');
    } else {
      // 设置请求时发生错误
      message.error(`请求配置错误: ${error.message}`);
    }
    
    return Promise.reject(error);
  }
);

// 重写get方法的类型
const originalGet = api.get;
api.get = async function<T>(url: string, config?: any): Promise<T> {
  const response = await originalGet(url, config);
  return response as T;
};

export default api; 