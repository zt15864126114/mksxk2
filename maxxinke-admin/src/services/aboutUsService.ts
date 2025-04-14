import request from '../utils/request';

export interface AboutUs {
  id?: number;
  companyIntro: string;
  coreAdvantages: string;
  productAdvantages: string;
  applicationAreas: string;
  createTime?: string;
  updateTime?: string;
}

export const aboutUsService = {
  // 获取关于我们信息
  getAboutUs: () => {
    return request.get<AboutUs>('/about-us');
  },

  // 保存关于我们信息
  saveAboutUs: (data: AboutUs) => {
    return request.post<AboutUs>('/about-us', data);
  }
}; 