
import axios from "./axiosConfig";
import { HomeList } from "@/types/home";
import  {sheach,ThreadResponse} from "@/types/thread"
// --- 1. MANAGEMENT THREADS API (Thao tác Create/Update/Delete) ---
const APIThreads = {
  // Lấy danh sách (Feed) - API chính cho trang chủ
  getFeed: async (params: HomeList) => {
    return await axios.get("/threads", { params });
  },

  // Tạo bài viết mới (Gửi FormData chứa file)
  create: async (formData: FormData) => {
    return await axios.post("/threads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Lấy chi tiết bài viết (Private - dùng khi bấm nút "Chỉnh sửa")
  getById: async (id: string) => {
    return await axios.get(`/threads/${id}`);
  },

  // Cập nhật bài viết
  update: async (id: string, formData: FormData) => {
    return await axios.put<ThreadResponse>(`/threads/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Xóa bài viết
  delete: async (id: string) => {
    return await axios.delete(`/threads/${id}`);
  },
};

// --- 2. PUBLIC VIEW API (Dùng cho trang xem chi tiết & SEO) ---
const APIPublicThreads = {
  // Lấy bài viết theo ID (Public View)
  getById: async (id: string) => {
    return await axios.get(`/public/${id}`);
  },


  getBySlug: async (slug: string) => {
    return await axios.get(`/public/slug/${slug}`);
  },

  // Lấy bài viết theo Category + Slug (SEO Chuẩn nhất - Next.js Page)
  getByFullSlug: async (categorySlug: string, threadSlug: string) => {
    return await axios.get(`/public/posts/${categorySlug}/${threadSlug}`);
  },

  // Lấy danh sách bài viết của 1 User (Trang Profile)
  getUserThreads: async (userId: string, params: HomeList) => {
    return await axios.get(`/public/users/profile/${userId}`, { params });
  },
  sheach: async (data :sheach)=>{
  const res= await axios.get("public/seach/smart",{params:data})
    return res.data
  }
};

// --- EXPORT ---
const api = {
  ...APIThreads,
  public: APIPublicThreads,
  

  APIhome: APIThreads.getFeed,
  APICreate: APIThreads.create,
  APIgetThreadById: APIPublicThreads.getUserThreads, 
};

export default api;