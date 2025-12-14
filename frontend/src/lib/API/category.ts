import axiosInstance from "@/lib/API/axiosConfig"; // Import cái axios xịn xò đã config
import {categoriesPopularList,tagPopularList,} from "@/types/categories"
import { 
  
  CategoryStatsSummary,
  CategoryGrowthResponse,
  CategoryDistributionResponse,
  
  GrowthParams,
  DistributionParams
} from "@/types/categories";

// 1. Type cho Category trả về
interface Category {
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface CategoryEdit {
  name?: string | null;
  description?: string | null;
}

// 2. Type cho dữ liệu tạo mới gửi lên
export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export const categoryService = {
  // Lấy toàn bộ danh mục
  getAll: async () => {
    const response = await axiosInstance.get<Category[]>(
      "/catcategory/categories"
    );
    return response.data;
  },

  // Tạo mới danh mục
  create: async (data: CreateCategoryPayload) => {
    const response = await axiosInstance.post<Category>(
      "/catcategory/create",
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    await axiosInstance.delete(`/catcategory/delete/${id}`);
  },

  edit: async (id: string, data: CategoryEdit) => {
    const response = await axiosInstance.put(`/catcategory/edit/${id}`, data);
    return response.data;
  },

  category_theads : async ()=>{
    return await axiosInstance.get("/public/categories/get")
    
  },
  tagPopular: async (limit: number = 10) => {
  const res = await axiosInstance.get<tagPopularList>(
    "/public/tags/popular",
    {
      params: { limit }
    }
  );
  return res.data;
},

categoriesPopular : async ()=>{
  const res = await axiosInstance.get<categoriesPopularList>("/public/categories/popular")
  return res.data
},
// --- 1. LẤY THỐNG KÊ TỔNG QUAN (Cho Card Info) ---
  getStats: async (categoryId: string): Promise<CategoryStatsSummary> => {
    const { data } = await axiosInstance.get<CategoryStatsSummary>(
      `router_dashboard/admin/category/${categoryId}`
    );
    return data;
  },

  // --- 2. LẤY DỮ LIỆU TĂNG TRƯỞNG (Cho Line Chart) ---
  getGrowth: async (categoryId: string, params?: GrowthParams): Promise<CategoryGrowthResponse> => {
    const { data } = await axiosInstance.get<CategoryGrowthResponse>(
      `/router_dashboard/admin/category/${categoryId}/growth`,
      { params }
    );
    return data;
  },

getDistribution: async (params?: DistributionParams): Promise<CategoryDistributionResponse> => {
    const { data } = await axiosInstance.get<CategoryDistributionResponse>(
      `/router_dashboard/admin/category/distribution/tuan`,
      { params }
    );
    return data;
    
  },
   deleteTag : async (id:string)=>{
    return await axiosInstance.delete(`router_dashboard/admin/tags/${id}`)
  }


};
