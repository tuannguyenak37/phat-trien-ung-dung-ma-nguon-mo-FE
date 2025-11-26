"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/lib/API/category";
import CreateCategoryModal from "./CreateCategory";
import { PlusIcon } from "@heroicons/react/24/outline";
import DeleteCategory from "./DeleteCategory";
import EditCategoryModal from "./EditCategoryModal";
export default function CategoriesPage() {
  // State để đóng/mở modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch dữ liệu danh sách (Tự động chạy khi vào trang)
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"], // Key định danh để cache và invalidate
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
      {/* Header Trang: Tiêu đề + Nút Thêm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Danh Mục</h1>
          <p className="text-sm text-gray-500">
            Danh sách các chủ đề hiện có trên hệ thống
          </p>
        </div>

        {/* NÚT MỞ MODAL */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 font-medium"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Thêm mới
        </button>
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                  {/* Tên */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {cat.name}
                  </td>

                  {/* Slug */}
                  <td className="px-6 py-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md border border-blue-100">
                      /{cat.slug}
                    </span>
                  </td>

                  {/* Mô tả */}
                  <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">
                    {cat.description || (
                      <span className="italic text-gray-300">Không có</span>
                    )}
                  </td>

                  {/* Actions Buttons */}
                  <td className="px-6 py-4 text-right space-x-2">
                    {/* <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer rounded-lg transition-all"
                      title="Sửa"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button> */}
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

              {/* Empty State */}
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

      {/* 👇 NHÚNG MODAL VÀO ĐÂY */}
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

// Import icon cho empty state (để ở đầu file nếu chưa có)
import { FolderIcon } from "@heroicons/react/24/outline";
