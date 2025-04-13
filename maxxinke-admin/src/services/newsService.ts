import { newsAPI } from './api';
import type { News } from '../types/news';

export interface NewsResponse {
  content: News[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const getNews = (params: any) => {
  return newsAPI.getNewsList(params);
};

export const getNewsById = async (id: string) => {
  try {
    const response = await newsAPI.getNewsItem(id);
    return response;
  } catch (error) {
    console.error('获取新闻详情失败:', error);
    throw error;
  }
};

export const createNews = async (data: FormData) => {
  try {
    const response = await newsAPI.createNewsItem(data);
    return response;
  } catch (error) {
    console.error('创建新闻失败:', error);
    throw error;
  }
};

export const updateNews = async (id: string, data: FormData) => {
  try {
    const response = await newsAPI.updateNewsItem(id, data);
    return response;
  } catch (error) {
    console.error('更新新闻失败:', error);
    throw error;
  }
};

export const deleteNews = (id: string) => {
  return newsAPI.deleteNewsItem(id);
}; 