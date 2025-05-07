import api from './api';
import { request } from '../utils/request';

/**
 * 联系方式信息接口
 */
export interface ContactInfo {
  tel: string;        // 电话
  mobile: string;     // 手机
  email: string;      // 邮箱
  serviceEmail: string; // 客服邮箱
  address: string;    // 地址
  postcode: string;   // 邮编
  website: string;    // 网站
  wechat: string;     // 微信公众号
}

/**
 * 检查API连接状态
 * 用于调试
 */
export const checkApiConnection = async (): Promise<void> => {
  try {
    const url = '/system/config/contact';
    // console.log(`尝试连接API: ${url}`);
    const response = await api.get(url);
    // console.log('API连接成功，响应:', response);
    
    // 验证响应是否符合预期
    if (!response || typeof response !== 'object') {
      throw new Error(`API响应格式不正确: ${JSON.stringify(response)}`);
    }
  } catch (error) {
    console.error('API连接失败:', error);
    throw error;
  }
};

/**
 * 获取联系方式信息
 * @returns 联系方式信息
 */
export const getContactInfo = async (): Promise<ContactInfo> => {
  try {
    // console.log('开始获取联系方式数据');
    
    // 构造更详细的请求信息，帮助调试
    // console.log('请求详情:', {
    //   endpoint: '/system/config/contact',
    //   method: 'GET',
    //   headers: { 'Content-Type': 'application/json' }
    // });
    //
    const response = await api.get<any>('/system/config/contact');
    
    // console.log('获取联系方式数据成功，原始响应:', response);
    
    // 验证响应格式
    if (!response || typeof response !== 'object') {
      console.error('联系方式数据格式错误:', response);
      throw new Error('获取的联系方式数据格式不正确');
    }
    
    // 构造标准的联系方式响应对象
    const contactInfo: ContactInfo = {
      tel: response.tel || '',
      mobile: response.mobile || '',
      email: response.email || '',
      serviceEmail: response.serviceEmail || '',
      address: response.address || '',
      postcode: response.postcode || '',
      website: response.website || '',
      wechat: response.wechat || ''
    };
    
    // console.log('格式化后的联系方式数据:', contactInfo);
    
    // 验证数据是否有效
    const hasValidData = Object.values(contactInfo).some(val => val !== '');
    if (!hasValidData) {
      console.warn('获取的联系方式数据全部为空');
    }
    
    return contactInfo;
  } catch (error) {
    console.error('获取联系方式数据失败:', error);
    // 返回空对象，让调用方决定如何处理
    return {
      tel: '',
      mobile: '',
      email: '',
      serviceEmail: '',
      address: '',
      postcode: '',
      website: '',
      wechat: ''
    };
  }
};

/**
 * 更新联系方式信息（仅管理员可用）
 * @param contactInfo 联系方式信息
 * @returns 更新结果
 */
export const updateContactInfo = async (contactInfo: ContactInfo): Promise<any> => {
  try {
    // console.log('更新联系方式数据:', contactInfo);
    const response = await api.put<any>('/system/config/contact', contactInfo);
    // console.log('更新联系方式成功:', response);
    return response;
  } catch (error) {
    console.error('更新联系方式失败:', error);
    throw error;
  }
};