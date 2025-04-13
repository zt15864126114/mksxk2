import { newsAPI } from './api';
import type { News } from '../types/news';

export const getNews = async (params?: any) => {
  try {
    const response = await newsAPI.getNewsList(params);
    return response;
  } catch (error) {
    console.error('获取新闻列表失败:', error);
    throw error;
  }
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

export const createNews = async (news: News) => {
  try {
    const response = await newsAPI.createNewsItem(news);
    return response;
  } catch (error) {
    console.error('创建新闻失败:', error);
    throw error;
  }
};

export const updateNews = async (id: string, news: News) => {
  try {
    const response = await newsAPI.updateNewsItem(id, news);
    return response;
  } catch (error) {
    console.error('更新新闻失败:', error);
    throw error;
  }
};

export const deleteNews = async (id: string) => {
  try {
    const response = await newsAPI.deleteNewsItem(id);
    return response;
  } catch (error) {
    console.error('删除新闻失败:', error);
    throw error;
  }
}; 