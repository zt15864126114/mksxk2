import request from '@/utils/request';

// ... (existing code for login, logout, etc.)

export const authService = {
  // ... (existing login, logout functions)
  
  changePassword: async (adminId: number, newPassword: string) => {
    // 更新为使用正确的后端API路径，与AdminController实现保持一致
    const response = await request.put(`/admins/${adminId}/password`, newPassword);
    return response;
  },
}; 