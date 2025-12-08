import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { MagnifyingGlassIcon, FireIcon, TagIcon, FolderIcon } from "@heroicons/react/24/outline";

// 1. Import components (Đúng đường dẫn của bạn)
import InfiniteFeed from "@/components/ui/InfiniteFeed";
import SearchBar from "@/components/ui/SearchBar";
import api from "@/lib/API/thead"; 
import {categoryService}  from "@/lib/API/category"
// 2. Định nghĩa Props (Next.js 15: searchParams là Promise)
interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 3. SEO động
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || resolvedParams.search || "";
  
  return {
    title: query ? `Kết quả tìm kiếm cho "${query}"` : "Tìm kiếm & Khám phá",
    description: "Khám phá các bài viết, chủ đề và từ khóa nổi bật.",
  };
}

// 4. Page Component
export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  
  // Lấy tham số từ URL
  const query = (resolvedParams.q || resolvedParams.search || "").toString();
  const categoryId = resolvedParams.category_id?.toString();
  const tagName = resolvedParams.tag?.toString();

  // --- FETCH DATA SONG SONG ---
  // Gọi 3 API cùng lúc để tối ưu tốc độ tải trang
  const [initialData, popularCategories, popularTags] = await Promise.all([
    // A. Lấy danh sách bài viết (Search)
    // Lưu ý: Dùng api.getFeed thay vì api.public.sheach
    api.public.sheach({ 
      search: query, 
      category_id: categoryId,
      tag: tagName,
      page: 1, 
      limit: 10 
    }).catch(() => ({ data: [], total: 0, page: 1, size: 10 })),

    categoryService.categoriesPopular().catch(() => []),

    // C. Lấy tags nổi bật (Sử dụng categoryService.tag)
    categoryService.tagPopular().catch(() => []),
  ]);
 return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        
        {/* Thanh tìm kiếm */}
        <div className="mb-8 max-w-2xl mx-auto">
           <SearchBar />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- CỘT TRÁI: KẾT QUẢ TÌM KIẾM (8/12) --- */}
            <div className="lg:col-span-8">
                {/* Header Kết quả */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    {query ? (
                        <>
                            <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
                            Kết quả cho: <span className="text-blue-600">"{query}"</span>
                        </>
                    ) : categoryId ? (
                        <>
                            <FolderIcon className="w-6 h-6 text-blue-600" />
                            Danh mục đang chọn
                        </>
                    ) : tagName ? (
                        <>
                            <TagIcon className="w-6 h-6 text-blue-600" />
                            Thẻ: <span className="text-blue-600">#{tagName}</span>
                        </>
                    ) : (
                        <>
                            <FireIcon className="w-6 h-6 text-orange-500" />
                            Khám phá bài viết mới
                        </>
                    )}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Tìm thấy {initialData.total || 0} bài viết phù hợp
                    </p>
                </div>

                {/* Feed List */}
                {/* Truyền key để reset trạng thái khi params thay đổi */}
                <InfiniteFeed 
                    key={JSON.stringify(resolvedParams)} 
                    initialData={initialData} 
                    searchParam={query}
                />
            </div>

            {/* --- CỘT PHẢI: SIDEBAR GỢI Ý (4/12) --- */}
            <div className="lg:col-span-4 space-y-8">
                
                {/* 1. Danh mục nổi bật */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FolderIcon className="w-5 h-5 text-gray-500" /> Danh mục nổi bật
                    </h3>
                    <div className="flex flex-col gap-2">
                        <Link 
                            href="/search" 
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!categoryId ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Tất cả danh mục
                        </Link>
                        {/* Render danh mục từ API */}
                        {(popularCategories as any[] || []).map((cat) => (
                            <Link 
                                key={cat.category_id} 
                                href={`/search?category_id=${cat.category_id}`}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${categoryId === cat.category_id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* 2. Từ khóa (Tags) thịnh hành */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <TagIcon className="w-5 h-5 text-gray-500" /> Từ khóa thịnh hành
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {(popularTags as any[] || []).map((tag) => (
                            <Link 
                                key={tag.tag_id} 
                                href={`/search?tag=${tag.name}`}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${tagName === tag.name ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}
                            >
                                #{tag.name}
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </main>
  );
}