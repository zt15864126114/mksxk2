import { request } from '../utils/request';
import { config } from '../config';

export interface Message {
  id?: number;
  name: string;
  email: string;
  phone: string;
  content: string;
  status?: number;
  createTime?: string;
  updateTime?: string;
}

export const messageService = {
  /**
   * 创建新留言
   * @param message 留言信息
   * @returns Promise<Message>
   */
  create: (message: Message) => {
    return request.post<Message>(`${config.apiBaseUrl}/api/messages`, message);
  },

  /**
   * 获取留言列表
   * @param page 页码
   * @param pageSize 每页数量
   * @returns Promise<{ content: Message[]; totalElements: number }>
   */
  getList: (page: number, pageSize: number) => {
    return request.get<{ content: Message[]; totalElements: number }>(
      `${config.apiBaseUrl}/api/messages`,
      {
        params: {
          page,
          pageSize,
        },
      }
    );
  },
}; 