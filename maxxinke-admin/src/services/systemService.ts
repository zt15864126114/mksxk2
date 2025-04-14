import request from '../utils/request';
import type { ContactInfo } from '../types/system';

/**
 * 系统服务
 */
export const systemService = {
  /**
   * 获取联系方式
   * @returns 联系方式信息
   */
  getContactInfo: async (): Promise<ContactInfo> => {
    const response = await request.get<ContactInfo>('/system/config/contact');
    return response;
  },
  
  /**
   * 更新联系方式
   * @param contactInfo 联系方式信息
   * @returns 更新结果
   */
  updateContactInfo: async (contactInfo: ContactInfo): Promise<any> => {
    return request.put<any>('/system/config/contact', contactInfo);
  }
}; 