import axiosInstance from "@/lib/API/axiosConfig"; // Import cái axios xịn xò đã config

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
    
  }

};
