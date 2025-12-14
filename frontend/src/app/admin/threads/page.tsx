"use client";

import { useQuery } from "@tanstack/react-query";
import InfiniteFeed from "@/components/ui/InfiniteFeed"; // Đảm bảo đúng đường dẫn component của bạn
import  threadService  from "@/lib/API/thead";
import { HomeList } from "@/types/home";

export default function AdminPostsPage() {
  
  // 1. Lấy dữ liệu trang đầu tiên (Page 1)
  const { data: initialData, isLoading } = useQuery({
    queryKey: ["admin-feed-initial"],
    queryFn: () => threadService.APIhome(1, 10), // Gọi API Admin lấy 10 bài mới nhất
  });

  // 2. Viết hàm adapter để InfiniteFeed gọi khi cuộn xuống
  // InfiniteFeed truyền vào params kiểu HomeList, ta map nó sang API Admin
  const fetchAdminData = async (params: HomeList) => {
    return await threadService.APIhome(
      params.page || 1, 
      params.limit || 10, 
     
    );
  };

  if (isLoading) {
    return <div className="p-12 text-center text-gray-500">Đang tải danh sách bài viết...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Bài viết</h1>
        <p className="mt-1 text-sm text-gray-500">
          Danh sách tất cả bài viết (Giao diện Feed)
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        {/* Nếu có dữ liệu thì mới render Feed */}
        {initialData && (
          <InfiniteFeed 
            initialData={initialData} // Dữ liệu trang 1
            fetchData={fetchAdminData} // Hàm lấy dữ liệu trang 2, 3... (API Admin)
            sort_by="newest" // Mặc định Admin xem mới nhất
          />
        )}
      </div>
    </div>
  );
}