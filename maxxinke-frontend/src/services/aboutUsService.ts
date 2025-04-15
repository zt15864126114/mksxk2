import api from './api';

/**
 * 关于我们信息接口
 * 定义了关于我们页面的数据结构
 */
export interface AboutUs {
  /** 记录ID */
  id: number;
  /** 公司简介 */
  companyIntro: string;
  /** 核心优势 */
  coreAdvantages: string;
  /** 产品优势 */
  productAdvantages: string;
  /** 应用领域 */
  applicationAreas: string;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
}

/**
 * 关于我们服务
 * 提供与后端API交互的方法
 */
export const aboutUsService = {
  /**
   * 获取最新的关于我们信息
   * 
   * @returns Promise<AboutUs> 返回关于我们信息的Promise
   */
  getAboutUs: async (): Promise<AboutUs> => {
    const response = await api.get<AboutUs>('/about-us');
    return response;
  }
}; 