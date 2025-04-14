import request from '@/utils/request';

export interface News {
  id: number;
  title: string;
  type: string;
  content: string;
  summary: string;
  image: string;
  status: number;
  createTime: string;
  updateTime: string;
}

export interface NewsListParams {
  page?: number;
  pageSize?: number;
  type?: string;
  status?: number;
}

export interface NewsListResponse {
  content: News[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface NewsResponse {
  content: News[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const getNews = async (params: NewsListParams): Promise<NewsResponse> => {
  const adjustedParams = {
    ...params,
    page: (params.page || 1) - 1, // 将页码减1以适配Spring Boot的分页
    size: params.pageSize
  };
  
  const response = await request.get<NewsResponse>('/news', { 
    params: adjustedParams
  });
  return response;
};

export const getNewsById = async (id: string) => {
  const response = await request.get<News>(`/news/${id}`);
  return response;
};

export const createNews = async (formData: FormData) => {
  const response = await request.post<News>('/news', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const updateNews = async (id: string, formData: FormData) => {
  const response = await request.put<News>(`/news/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const deleteNews = async (id: string) => {
  await request.delete(`/news/${id}`);
}; 