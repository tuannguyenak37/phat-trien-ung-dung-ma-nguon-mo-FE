"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/lib/API/category";
import CreateCategoryModal from "./CreateCategory";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategory from "./DeleteCategory";
import CategoryStatsTab from "./CategoryStatsTab"; // <--- Import component vừa tạo
import { 
  PlusIcon, FolderIcon, ChartBarIcon, ListBulletIcon 
} from "@heroicons/react/24/outline";

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"list" | "stats">("list"); // <--- State quản lý Tab

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getAll,
  });

  if (isLoading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="space-y-6">
      {/* Header Trang */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản Lý Danh Mục</h1>
          <p className="text-sm text-gray-500">Danh sách các chủ đề hiện có trên hệ thống</p>
        </div>
        
        {/* Chỉ hiện nút Thêm mới khi ở tab List */}
        {activeTab === "list" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all font-medium"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Thêm mới
          </button>
        )}
      </div>

      {/* --- THANH TAB SWITCHER --- */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("list")}
            className={`
              flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
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
              flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
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

      {/* --- NỘI DUNG TAB --- */}
      <div className="mt-6">
        {activeTab === "list" ? (
          /* PHẦN DANH SÁCH (CŨ) */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             {/* ... (Giữ nguyên phần Table của bạn ở đây) ... */}
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    {/* Header Table */}
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 border-b">Tên danh mục</th>
                            <th className="px-6 py-4 border-b">Slug</th>
                            <th className="px-6 py-4 border-b">Mô tả</th>
                            <th className="px-6 py-4 border-b text-right">Hành động</th>
                        </tr>
                    </thead>
                    {/* Body Table */}
                    <tbody className="divide-y divide-gray-100">
                      {categories?.map((cat) => (
                        <tr key={cat.category_id} className="hover:bg-blue-50/50 transition-colors group">
                           <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                           <td className="px-6 py-4"><span className="px-2 py-1 text-xs text-blue-600 bg-blue-50 rounded-md border border-blue-100">/{cat.slug}</span></td>
                           <td className="px-6 py-4 text-gray-500 text-sm max-w-xs truncate">{cat.description || "--"}</td>
                           <td className="px-6 py-4 text-right space-x-2">
                             <EditCategoryModal categoryId={cat.category_id} defaultData={cat} />
                             <DeleteCategory id={cat.category_id} />
                           </td>
                        </tr>
                      ))}
                      {categories?.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-12 text-gray-400"><FolderIcon className="w-12 h-12 mx-auto mb-3"/>Chưa có dữ liệu</td></tr>
                      )}
                    </tbody>
                </table>
             </div>
          </div>
        ) : (
          /* PHẦN THỐNG KÊ (MỚI) */
          // Truyền danh sách categories vào để làm dữ liệu cho Dropdown chọn
          <CategoryStatsTab allCategories={categories || []} />
        )}
      </div>

      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}