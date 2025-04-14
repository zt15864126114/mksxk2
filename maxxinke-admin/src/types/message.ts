export interface Message {
  id?: number;
  name: string;
  email: string;
  phone: string;
  content: string;
  status: string | number;
  createTime?: string;
  updateTime?: string;
} 