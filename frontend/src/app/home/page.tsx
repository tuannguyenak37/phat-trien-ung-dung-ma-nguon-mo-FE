// app/page.tsx (hoặc app/home/page.tsx tùy cấu trúc của bạn)
import React from "react";
import { getThreads } from "@/lib/hook/getThreads";
import InfiniteFeed from "@/components/ui/InfiniteFeed";
import CreateThreadForm from "@/components/ui/CreateThreadForm";
import { FeedWrapper } from "@/components/layout/FeedWrapper"; // Component vừa tạo ở trên
import { ArrowPathIcon } from "@heroicons/react/24/solid";

export default async function Home() {
  // Gọi API lấy dữ liệu
  // Lưu ý: Trong thực tế nên try-catch để tránh crash cả trang
  let apiResponse = null;
  try {
    apiResponse = await getThreads(1, 10);
  } catch (error) {
    console.error("Fetch error:", error);
  }

  // Fallback UI khi lỗi
  if (!apiResponse) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-4 bg-red-50 rounded-full">
           <ArrowPathIcon className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Không thể tải bảng tin</h3>
          <p className="text-gray-500 text-sm">Vui lòng kiểm tra kết nối và thử lại sau.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto">
      <FeedWrapper>
        {/* Header Section */}
        <div className="flex items-center justify-between mb-2 px-1">
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            Bảng tin
          </h1>
          <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            Mới nhất
          </span>
        </div>

        {/* Create Post Section - Card Style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md">
           {/* Component form sẽ nằm gọn trong card này */}
           <CreateThreadForm />
        </div>

        {/* Separator */}
        <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="bg-slate-50 px-2 text-xs text-gray-400 font-medium uppercase tracking-wider">
                    Bài viết gần đây
                </span>
            </div>
        </div>

        {/* Feed Content */}
        <div className="min-h-[500px]">
           <InfiniteFeed initialData={apiResponse} />
        </div>
      </FeedWrapper>
    </section>
  );
}