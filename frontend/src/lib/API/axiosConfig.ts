// lib/axiosConfig.ts
import axios from "axios";
import { useAuthStore } from "../store/tokenStore";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor (Giữ nguyên)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor (ĐÃ SỬA LỖI LOOP)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 👇 1. QUAN TRỌNG: Nếu API bị lỗi chính là API refresh token thì DỪNG NGAY.
    // Không cố refresh nữa để tránh lặp vô tận.
    if (originalRequest.url && originalRequest.url.includes("/token/refresh")) {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 và chưa từng thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Access Token hết hạn, đang thử refresh ngầm...");

        // Gọi API Refresh Token bằng axios gốc
        const refreshResponse = await axios.post(
          `${
            process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:5000/api"
          }/token/refresh`,
          {},
          { withCredentials: true }
        );

        const data = refreshResponse.data;
        const newAccessToken = data.access_token || data.accessToken;

        if (newAccessToken) {
          const userInfo = {
            user_id: data.user_id,
            role: data.role,
            firstName: data.firstName,
            lastName: data.lastName,
          };

          useAuthStore.getState().setAuth(newAccessToken, userInfo);

          // Cập nhật header cho request cũ và gọi lại
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ Refresh thất bại (Cookie hết hạn):", refreshError);
        
        // Logout sạch sẽ
        useAuthStore.getState().logout();

        // 👇 2. QUAN TRỌNG: Kiểm tra xem đang ở đâu trước khi reload
        // Nếu đang ở trang login rồi thì ĐỪNG reload nữa
        if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            // Danh sách các trang không cần redirect (Login, Register...)
            const publicPaths = ["/auth/login", "/login", "/register"];
            
            if (!publicPaths.includes(currentPath)) {
                 window.location.href = "/auth/login"; 
            }
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;