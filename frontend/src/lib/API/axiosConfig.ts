// lib/axiosConfig.ts
import axios from "axios";
// 👇 1. Import store mà bạn đã tạo ở bước trước
import { useTokenStore } from "../store/tokenStore";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true, // ⬅️ QUAN TRỌNG: Để trình duyệt tự động gửi Cookie Refresh Token
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Gắn token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    
    const token = useTokenStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý lỗi
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 👇 (Tùy chọn nâng cao) Xử lý khi Token hết hạn giữa chừng (Lỗi 401)
    // Nếu server trả về 401 và request này chưa từng thử lại
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Logic: Có thể thêm code gọi refresh token ở đây nếu muốn
      // Nhưng hiện tại AuthProvider đã lo phần F5 rồi, nên ta cứ reject lỗi
      // để UI tự xử lý (ví dụ: đá ra trang login)
      console.log("Access Token hết hạn hoặc không hợp lệ");
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
