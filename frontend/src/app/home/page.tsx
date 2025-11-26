import React from "react";
import { getThreads } from "@/lib/hook/getThreads";
import InfiniteFeed from "@/components/ui/InfiniteFeed";
import CreateThreadForm from "@/components/ui/CreateThreadForm";
export default async function Home() {

  
  // 1. Gọi API lấy trang 1, size 10 (Chạy trên Server)
  const apiResponse = await getThreads(1, 10);

  // Xử lý trường hợp API lỗi hoặc null
  if (!apiResponse) {
    return (
      <div className="text-gray-500 text-center py-10">
        Không thể tải dữ liệu.
      </div>
    );
  }

  return (
    <section>
      {/* Banner tiêu đề */}
      <div className="mb-6 border-b border-red-900/20 pb-2">
        <h1 className="font-serif text-2xl font-bold text-gray-200 uppercase">
          <CreateThreadForm />
        </h1>
      </div>

      {/* 2. Truyền toàn bộ response vào Client Component */}
      <InfiniteFeed initialData={apiResponse} />
    </section>
  );
}
