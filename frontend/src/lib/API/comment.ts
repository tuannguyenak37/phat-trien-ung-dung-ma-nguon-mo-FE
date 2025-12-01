import axiosClient from "@/lib/API/axiosConfig";
import { CommentListResponse, Comment } from "@/types/comment";

export const commentApi = {
  // 1. Lấy danh sách (Có thể lọc theo thread hoặc parent)
  getComments: async (params: { 
    thread_id?: string; 
    parent_comment_id?: string; 
    page?: number; 
    limit?: number 
  }) => {
    const response = await axiosClient.get<CommentListResponse>("/cmt/comments/", { params });
    return response.data;
  },

  // 2. Tạo comment / Reply
  createComment: async (payload: { thread_id: string; content: string; parent_comment_id?: string }) => {
    const response = await axiosClient.post<Comment>("/cmt/comments/", payload);
    return response.data;
  },

  // 3. Sửa
  updateComment: async (id: string, content: string) => {
    const response = await axiosClient.put<Comment>(`/cmt/comments/${id}`, { content });
    return response.data;
  },

  // 4. Xóa
  deleteComment: async (id: string) => {
    return await axiosClient.delete(`/cmt/comments/${id}`);
  }
};