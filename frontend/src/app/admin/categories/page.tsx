"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/lib/API/category";

// Import Components cũ
import CreateCategoryModal from "./CreateCategory";
import { PlusIcon, FolderIcon, ChartBarIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import DeleteCategory from "./DeleteCategory";
import EditCategoryModal from "./EditCategoryModal";

// Import Component Thống kê mới (Đảm bảo bạn đã tạo file này như hướng dẫn trước)
import CategoryStatsTab from "./CategoryStatsTab";

export default function CategoriesPage() {
  // State để đóng/mở modal thêm mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 1. State quản lý Tab đang chọn ('list' hoặc 'stats')
  const [activeTab, setActiveTab] = useState<"list" | "stats">("list");

  // Fetch dữ liệu danh sách
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-2"></div>
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="space-y-6">
      {/* --- HEADER TRANG --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Danh Mục</h1>
          <p className="text-sm text-gray-500">
            Danh sách các chủ đề hiện có trên hệ thống
          </p>
        </div>

        {/* NÚT THÊM MỚI (Chỉ hiện khi ở Tab Danh Sách) */}
        {activeTab === "list" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 font-medium"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Thêm mới
          </button>
        )}
      </div>

      {/* --- THANH ĐIỀU HƯỚNG TAB (TAB NAVIGATION) --- */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("list")}
            className={`
              flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${activeTab === "list" 
                ? "border-blue-500 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
          >
            <ListBulletIcon className="w-5 h-5 mr-2" />
            Danh sách
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`
              flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
              ${activeTab === "stats" 
                ? "border-blue-500 text-blue-600" 
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
            `}
          >
            <ChartBarIcon className="w-5 h-5 mr-2" />
            Thống kê & Báo cáo
          </button>
        </nav>
      </div>

      {/* --- NỘI DUNG CHÍNH (Thay đổi dựa theo Tab) --- */}
      <div className="mt-2">
        {activeTab === "list" ? (
          // ================= GIAO DIỆN DANH SÁCH (CŨ) =================
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4 border-b">Tên danh mục</th>
                    <th className="px-6 py-4 border-b">Đường dẫn (Slug)</th>
                    <th className="px-6 py-4 border-b">Mô tả</th>
                    <th className="px-6 py-4 border-b text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories?.map((cat) => (
                    <tr
                      key={cat.category_id}
                      className="hover:bg-blue-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {cat.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-100">
                          /{cat.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">
                        {cat.description || (
                          <span className="italic text-gray-300">Không có</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <EditCategoryModal
                          categoryId={cat.category_id}
                          defaultData={{
                            name: cat.name,
                            description: cat.description,
                          }}
                        />
                        <DeleteCategory id={cat.category_id} />
                      </td>
                    </tr>
                  ))}

                  {categories?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-400">
                        <FolderIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Chưa có danh mục nào.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // ================= GIAO DIỆN THỐNG KÊ (MỚI) =================
          // Truyền danh sách categories vào để component con dùng làm Dropdown
          <CategoryStatsTab allCategories={categories || []} />
        )}
      </div>

      {/* Modal Tạo Mới (Luôn render nhưng ẩn hiện theo state) */}
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}