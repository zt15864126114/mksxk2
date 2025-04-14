import { messagesAPI } from './api';
import type { Message } from '../types/message';
import type { PaginationParams, PaginatedResponse } from './api';

export const messageService = {
  getMessages: async (params?: PaginationParams) => {
    try {
      const adjustedParams = params ? {
        ...params,
        page: params.page - 1  // 将页码减1以适配Spring Boot的分页
      } : undefined;
      const response = await messagesAPI.getMessages(adjustedParams);
      if (response && response.content) {
        return {
          data: {
            content: response.content,
            totalElements: response.totalElements,
            size: response.size,
            number: response.number,
          },
          total: response.totalElements,
          pageSize: response.size,
          current: response.number + 1,
        };
      } else {
        console.error('API响应格式不正确:', response);
        throw new Error('API响应格式不正确');
      }
    } catch (error) {
      console.error('获取消息列表失败:', error);
      throw error;
    }
  },

  getMessage: async (id: string) => {
    try {
      const response = await messagesAPI.getMessage(id);
      return response;
    } catch (error) {
      console.error('获取消息详情失败:', error);
      throw error;
    }
  },

  updateMessage: async (id: string, message: Message) => {
    try {
      const response = await messagesAPI.updateMessageStatus(id, message.status);
      return response;
    } catch (error) {
      console.error('更新消息失败:', error);
      throw error;
    }
  },

  deleteMessage: async (id: string) => {
    try {
      const response = await messagesAPI.deleteMessage(id);
      return response;
    } catch (error) {
      console.error('删除消息失败:', error);
      throw error;
    }
  },

  markAsRead: async (id: string) => {
    try {
      const response = await messagesAPI.updateMessageStatus(id, '1');
      return response;
    } catch (error) {
      console.error('标记消息为已读失败:', error);
      throw error;
    }
  },

  replyMessage: async (id: string, reply: string) => {
    try {
      const response = await messagesAPI.replyMessage(id, reply);
      return response;
    } catch (error) {
      console.error('回复消息失败:', error);
      throw error;
    }
  }
}; 