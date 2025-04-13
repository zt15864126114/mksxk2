import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3002/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，可以跳转到登录页
          break;
        case 403:
          // 权限不足
          break;
        case 404:
          // 资源不存在
          break;
        case 500:
          // 服务器错误
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default api; 