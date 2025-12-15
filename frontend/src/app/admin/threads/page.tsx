// app/dashboard/posts/page.tsx
import React from "react";
// Đảm bảo đường dẫn import đúng với cấu trúc dự án của bạn
import getThreads from "@/lib/API/thead"; 
import PostTable from "./PostTable"; // Import đúng đường dẫn component
import DashboardCharts from "./DashboardCharts"; // Import biểu đồ
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export const metadata = {
  title: "Quản lý bài viết | Dashboard",
};

export default async function DashboardPostsPage() {
  // Biến chứa dữ liệu sạch để truyền xuống Client
  let apiResponse = null;

  try {
    // 1. Gọi API
    const res = await getThreads.APIhome({ 
      page: 1, 
      limit: 20, 
      sort_by: "newest"
    });

    // 2. 🔥 QUAN TRỌNG: Lấy dữ liệu thật từ res.data
    // Axios trả về: { data: { data: [], total: ... }, status: 200, ... }
    // Ta chỉ cần phần { data: [], total: ... } bên trong.
    apiResponse = res.data; 

  } catch (error) {
    console.error("Fetch dashboard error:", error);
  }

  // 3. Xử lý trường hợp lỗi hoặc không có dữ liệu
  if (!apiResponse || !apiResponse.data) {
    return (
        <div className="p-10 text-center text-red-500">
            Lỗi tải dữ liệu hoặc không kết nối được Server.
        </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
            <p className="text-sm text-gray-500 mt-1">Xem thống kê, khóa và quản lý tất cả bài viết.</p>
        </div>
        
        {/* Nút tạo mới */}
        <Link 
            href="/" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm shadow-blue-200"
        >
            <PlusIcon className="w-5 h-5" />
            Viết bài mới
        </Link>
      </div>

      {/* --- PHẦN 1: BIỂU ĐỒ THỐNG KÊ (MỚI) --- */}
      {/* Truyền mảng bài viết vào để vẽ biểu đồ */}
      <DashboardCharts threads={apiResponse.data} />

      {/* --- PHẦN 2: BẢNG DỮ LIỆU --- */}
      <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Danh sách bài viết</h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                Tổng: {apiResponse.total} bài
            </span>
          </div>

          {/* Truyền data sạch vào bảng */}
          <PostTable initialData={apiResponse} />
      </div>
    </div>
  );
}