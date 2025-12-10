// app/page.tsx
import React from "react";
import { getThreads } from "@/lib/hook/getThreads";
import InfiniteFeed from "@/components/ui/InfiniteFeed";
import CreateThreadForm from "@/components/ui/CreateThreadForm";
import { FeedWrapper } from "@/components/layout/FeedWrapper"; 
import { ArrowPathIcon, FunnelIcon } from "@heroicons/react/24/solid";

// 1. CẬP NHẬT TYPE: searchParams là Promise
interface HomeProps {
  searchParams: Promise<{ 
    tag?: string; 
    category_id?: string;
    sort_by?: "mix" | "newest" | "trending";
  }>;
}

export default async function Home(props: HomeProps) {
  
  // 2. CẬP NHẬT LOGIC: Phải await props.searchParams trước khi dùng
  const searchParams = await props.searchParams;

  const tag = searchParams.tag;
  const category_id = searchParams.category_id;
  const sort_by = searchParams.sort_by || "mix";

  let apiResponse = null;
  
  try {
    apiResponse = await getThreads({ 
      page: 1, 
      limit: 10, 
      sort_by: sort_by as any,
      tag: tag,
      category_id: category_id
    });
  } catch (error) {
    console.error("Fetch error:", error);
  }

  // --- Logic hiển thị tiêu đề ---
  let title = "Bảng tin";
  let subtitle = "Mới nhất";
  
  if (tag) {
     title = `#${tag}`;
     subtitle = "Lọc theo thẻ";
  } else if (category_id) {
     title = "Danh mục"; 
     subtitle = "Lọc theo chủ đề";
  } else if (sort_by === 'trending') {
     title = "Thịnh hành";
     subtitle = "Hot tuần này";
  }

  // Fallback UI khi lỗi
  if (!apiResponse) {
    return (
       <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-4 bg-red-50 rounded-full"><ArrowPathIcon className="w-8 h-8 text-red-500" /></div>
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
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
             { (tag || category_id) && <FunnelIcon className="w-6 h-6 text-blue-600"/> }
             <h1 className="text-2xl font-black tracking-tight text-gray-900 truncate">
               {title}
             </h1>
          </div>
          <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm whitespace-nowrap">
            {subtitle}
          </span>
        </div>

        {/* Chỉ hiện form tạo bài viết khi ở trang chủ gốc */}
        {!tag && !category_id && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4 transition-all hover:shadow-md">
                <CreateThreadForm />
            </div>
        )}

        <div className="relative py-2">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-200"></div>
            </div>
        </div>

        {/* Feed Content */}
        <div className="min-h-[500px]">
           <InfiniteFeed 
             initialData={apiResponse} 
             fetchData={getThreads} 
             sort_by={sort_by as any}
             tag={tag}
             category_id={category_id}
           />
        </div>
      </FeedWrapper>
    </section>
  );
}