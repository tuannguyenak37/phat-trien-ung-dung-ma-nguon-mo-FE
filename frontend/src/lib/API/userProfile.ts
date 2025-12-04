import axiosClient from "./axiosConfig"; // Import instance đã cấu hình ở trên
import { 
  UpdateAvatarResponse, 
  UpdateBackgroundResponse, 
  UpdateInfoPayload, 
  UpdateInfoResponse,
  ChangePasswordResponse, 
  ChangePasswordPayload,
  ChangeEmailResponse, 
  ChangeEmailPayload 
} from "@/types/profile";

// --- 1. API Đổi Avatar (Sửa: Trả về res.data) ---
export const updateAvatarAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClient.put<UpdateAvatarResponse>("/users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data; // <--- QUAN TRỌNG: Chỉ trả về data
};

// --- 2. API Đổi Background (Sửa: Trả về res.data) ---
export const updateBackgroundAPI = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClient.put<UpdateBackgroundResponse>("/users/me/background", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data; // <--- QUAN TRỌNG
};

// Thêm hàm này vào
export const updateInfoAPI = async (data: UpdateInfoPayload) => {
  const res = await axiosClient.put<UpdateInfoResponse>("/users/me/info", data);
  return res.data;
};
// --- 4. API Đổi Mật khẩu ---
export const changePasswordAPI = async (data: ChangePasswordPayload) => {
  const res = await axiosClient.put<ChangePasswordResponse>("/users/me/password", data);
  return res.data; // <--- QUAN TRỌNG
};

// --- 5. API Đổi Email ---
export const changeEmailAPI = async (data: ChangeEmailPayload) => {
  const res = await axiosClient.put<ChangeEmailResponse>("/users/me/email", data);
  return res.data; // <--- QUAN TRỌNG
};