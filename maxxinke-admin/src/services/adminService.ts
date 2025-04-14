import { adminAPI } from './api';

export interface Admin {
  id: number;
  username: string;
  email?: string;
  createdTime?: string;
  updatedTime?: string;
}

let cachedAdmin: Admin | null = null;

export const adminService = {
  /**
   * 获取当前登录的管理员信息
   * 会缓存结果，减少重复请求
   */
  getCurrentAdmin: async (): Promise<Admin> => {
    if (cachedAdmin) {
      return cachedAdmin;
    }
    
    try {
      const admin = await adminAPI.getCurrentAdmin();
      cachedAdmin = admin;
      return admin;
    } catch (error) {
      console.error('获取当前管理员信息失败:', error);
      throw error;
    }
  },
  
  /**
   * 清除缓存的管理员信息
   * 在登出或修改管理员信息后调用
   */
  clearAdminCache: () => {
    cachedAdmin = null;
  },
  
  /**
   * 更新管理员密码
   * @param adminId 管理员ID
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  updatePassword: async (adminId: number, oldPassword: string, newPassword: string): Promise<void> => {
    try {
      // 先验证旧密码是否正确
      await adminAPI.validatePassword(adminId, oldPassword);
      
      // 再更新新密码
      await adminAPI.updatePassword(adminId, newPassword);
    } catch (error) {
      console.error('修改密码失败:', error);
      throw error;
    }
  }
}; 