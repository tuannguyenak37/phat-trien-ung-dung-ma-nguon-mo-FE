// lib/axiosConfig.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_BACKEND || "http://localhost:5000/api",
  timeout: 10000, // 10 giây
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor (tùy chọn) để xử lý lỗi hoặc token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // nếu có token lưu ở localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
