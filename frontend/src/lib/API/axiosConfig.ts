import axios from "axios";
import { useAuthStore } from "../store/tokenStore";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:5000/api",
  timeout: 10000,
  withCredentials: true, // Quan trọng: Để gửi kèm Cookie Refresh Token
  headers: {
    "Content-Type": "application/json",
  },
});

// =================================================================
// 1. REQUEST INTERCEPTOR
// =================================================================
axiosInstance.interceptors.request.use(
  (config) => {
    // Chỉ lấy từ Zustand (vì bạn không lưu Access Token ở LocalStorage/Cookie)
    const token = useAuthStore.getState().accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =================================================================
// 2. RESPONSE INTERCEPTOR
// =================================================================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // A. Chặn vòng lặp: Nếu chính API refresh bị lỗi thì dừng ngay
    if (originalRequest.url && originalRequest.url.includes("/token/refresh")) {
      return Promise.reject(error);
    }

    // B. Xử lý lỗi 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("🔄 Access Token hết hạn/thiếu, đang thử refresh bằng Cookie...");

        // Gọi API Refresh (Dùng axios gốc để tránh interceptor lặp lại)
        // Backend sẽ đọc Refresh Token từ Cookie HttpOnly
        const refreshResponse = await axios.post(
          `${
            process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:5000/api"
          }/token/refresh`,
          {},
          { withCredentials: true } // BẮT BUỘC
        );

        const data = refreshResponse.data;
        const newAccessToken = data.access_token || data.accessToken;

        if (newAccessToken) {
          // 1. Lưu vào Store
          const userInfo = {
            user_id: data.user_id,
            role: data.role,
            firstName: data.firstName,
            lastName: data.lastName,
            description:data.description,
            url_bg:  data.url_bg,
            reputation_score: data.reputation_score
          };
          useAuthStore.getState().setAuth(newAccessToken, userInfo);

          // 2. Gắn token mới vào header request cũ
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          // 3. Gọi lại request cũ
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("❌ Refresh thất bại (Cookie hết hạn hoặc không tồn tại):", refreshError);
        
        // Logout sạch sẽ
        useAuthStore.getState().logout();

        // Redirect về login (Chỉ làm nếu không phải trang public)
        if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            const publicPaths = ["/auth/login", "/login", "/register", "/home", "/"];
            
            // Nếu trang hiện tại KHÔNG nằm trong danh sách public thì mới redirect
            if (!publicPaths.some(path => currentPath.startsWith(path))) {
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