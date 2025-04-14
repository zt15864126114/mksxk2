/**
 * 应用配置文件
 * 包含API地址、环境变量等配置信息
 */

interface Config {
  apiBaseUrl: string;
  pagination: {
    defaultPageSize: number;
    pageSizeOptions: string[];
  };
  upload: {
    maxSize: number;
    acceptedFileTypes: string[];
  };
  theme: {
    primaryColor: string;
    successColor: string;
    warningColor: string;
    errorColor: string;
  };
}

// 环境变量优先级: 环境变量 > 配置文件
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3002';

console.log('应用配置初始化中...');
console.log('当前API基础地址:', API_BASE_URL);

export const config: Config = {
  // API基础URL
  apiBaseUrl: API_BASE_URL,

  // 分页配置
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: ['10', '20', '50', '100'],
  },

  // 文件上传配置
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
  },

  // 主题配置
  theme: {
    primaryColor: '#1890ff',
    successColor: '#52c41a',
    warningColor: '#faad14',
    errorColor: '#f5222d',
  },
};

// 为了向后兼容，也导出默认配置
export default config; 