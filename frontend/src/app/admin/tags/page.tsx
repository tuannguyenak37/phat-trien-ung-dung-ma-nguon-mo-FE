import { Metadata } from "next";
import TagManager from "./TagManager"; // Import component bảng danh sách vừa tạo

export const metadata: Metadata = {
  title: "Quản lý Thẻ (Tags) | Admin Dashboard",
  description: "Xem thống kê và xóa các thẻ trong hệ thống",
};

export default function TagsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Tiêu đề trang */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Thẻ (Tags)</h1>
        <p className="mt-1 text-sm text-gray-500">
          Danh sách các tag đang có trong hệ thống 
        </p>
      </div>

      {/* Component Danh sách Tag */}
      <div className="w-full">
        <TagManager />
      </div>
    </div>
  );
}