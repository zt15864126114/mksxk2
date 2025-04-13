import { create } from 'zustand';
import { authAPI } from '../services/api';

interface UserState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

// 从localStorage获取初始token
const getInitialToken = () => {
  const token = localStorage.getItem('token');
  return token;
};

export const useUserStore = create<UserState>()((set, get) => ({
  token: getInitialToken(),
  isLoading: false,
  error: null,
  isAuthenticated: !!getInitialToken(),

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login({ username, password });
      const { token } = response;
      
      localStorage.setItem('token', token);
      
      set({
        token,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('登录失败:', error);
      set({
        isLoading: false,
        error: '用户名或密码错误',
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
    });
    // 强制页面跳转到登录页
    window.location.href = '/login';
  },
  
  // 检查认证状态，可以在组件中调用
  checkAuth: () => {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;
    
    // 如果localStorage中有token但当前状态中没有，则更新状态
    if (token && !get().token) {
      set({ token, isAuthenticated: true });
      return true;
    }
    
    // 如果localStorage中没有token但当前状态中有，则清除状态
    if (!token && get().token) {
      set({ token: null, isAuthenticated: false });
      return false;
    }
    
    return isAuthenticated;
  }
})); 