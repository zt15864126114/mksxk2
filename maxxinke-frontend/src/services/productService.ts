import api from './api';
import { AxiosResponse } from 'axios';

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  specifications: ProductSpecification[];
  application: string;
  createTime: string;
  updateTime: string;
  status: number;
}

export interface ProductListResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ProductListParams {
  page: number;
  pageSize: number;
  category?: string;
  status?: number;
  keyword?: string;
  name?: string;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export const productService = {
  // 获取产品列表
  getProducts: async (params: ProductListParams): Promise<ProductListResponse> => {
    // 创建调整后的参数对象，只选择需要的参数
    const { page, pageSize, category, status, name, keyword } = params;
    
    const adjustedParams: Record<string, any> = {
      page: page - 1,  // 将页码减1以适配Spring Boot的分页
      size: pageSize   // 使用pageSize作为size参数
    };
    
    // 添加可选参数
    if (category) adjustedParams.category = category;
    if (status !== undefined) adjustedParams.status = status;
    
    // 根据后端API的实际实现，尝试不同的搜索参数名称
    if (name) {
      // 尝试多种可能的参数名
      adjustedParams.name = name;         // 尝试直接使用name
      adjustedParams.keyword = name;      // 尝试使用keyword
      adjustedParams.search = name;       // 尝试使用search
      adjustedParams.q = name;            // 尝试使用q (常见搜索参数)
    } else if (keyword) {
      adjustedParams.keyword = keyword;
    }
    
    console.log('产品搜索参数:', adjustedParams);
    
    try {
      const response = await api.get('/products', {
        params: adjustedParams
      });
      
      // 如果后端搜索不工作，尝试在前端进行过滤
      if (name && response && response.content && response.content.length > 0) {
        console.log('后端返回产品数量:', response.content.length);
        console.log('尝试前端过滤...');
        
        // 检查结果是否包含搜索词，如果全部结果不包含搜索词，可能需要前端过滤
        const nameMatches = response.content.filter(
          (p: Product) => p.name.toLowerCase().includes(name.toLowerCase())
        );
        
        // 如果后端没有过滤或过滤不正确，在前端应用过滤
        if (nameMatches.length < response.content.length) {
          console.log('应用前端过滤，找到匹配产品:', nameMatches.length);
          
          // 创建修正后的响应对象
          const filteredResponse = {
            ...response,
            content: nameMatches,
            totalElements: nameMatches.length
          };
          
          return filteredResponse;
        }
      }
      
      return response;
    } catch (error) {
      console.error('获取产品列表失败:', error);
      throw error;
    }
  },

  // 获取产品详情
  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response;
  },

  // 获取产品分类统计
  getCategories: async (): Promise<CategoryStat[]> => {
    try {
      const response = await api.get('/product-stats/categories');
      return response;
    } catch (error) {
      console.error('获取产品分类失败:', error);
      return [];
    }
  },

  // 获取热门产品
  getHotProducts: async (size: number = 3): Promise<Product[]> => {
    const response = await api.get('/product-stats/hot', {
      params: { limit: size }
    });
    return response;
  }
};