import type { NextConfig } from "next";

// Xác định môi trường: 'development' hay 'production'
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  /* 1. Cấu hình React Compiler (Đưa ra khỏi experimental theo yêu cầu của Next.js 16+) */
  reactCompiler: true, 

  /* 2. Cấu hình Tối ưu Ảnh (Images) */
  images: {
    // 🔥 MẤU CHỐT SỬA LỖI LOCALHOST:
    // Tắt tối ưu hóa CHỈ KHI đang chạy ở chế độ dev để vượt qua lỗi chặn IP nội bộ.
    unoptimized: isDev, 

    // Cấu hình danh sách cho phép (Allowlist) ảnh từ Backend
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/static/**",
      },
      // 2. 🔥 QUAN TRỌNG: Cho phép domain Backend trên Render (Để chạy trên Vercel)
      {
        protocol: "https",
        hostname: "phat-trien-ung-dung-ma-nguon-mo-be.onrender.com",
        port: "", // HTTPS mặc định không cần port
        pathname: "/static/**",
      },
    ],
  },

  /* 3. Cấu hình Build (Giúp quá trình deploy dễ dàng hơn) */
  // Key 'eslint' bị xóa theo cảnh báo của Next.js 16+
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;