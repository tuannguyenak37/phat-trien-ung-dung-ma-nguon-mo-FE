"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

// API & Types
import api from "@/lib/API/thead"; 
import { IThread } from "@/types/thread";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. State Input
  const [text, setText] = useState(searchParams.get("search") || "");
  const [isFocused, setIsFocused] = useState(false);
  
  // 2. Debounce: Chỉ search sau khi ngừng gõ 300ms
  const [query] = useDebounce(text, 300);

  // 3. Call Real-time Search API
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["quick-search", query],
    queryFn: async () => {
      // 1. Kiểm tra điều kiện đầu vào
      if (!query.trim()) return [];

      const params = { 
          search: query, 
          limit: 3, 
          page: 1 
      };

      // 🚀 LOG 1: Kiểm tra dữ liệu GỬI ĐI
      console.log("%c🚀 [SEARCH] Params gửi đi:", "color: blue; font-weight: bold;", params);
      
      try {
          // Gọi API (Lưu ý: Bạn đang dùng tên hàm là 'sheach', hãy chắc chắn bên file API cũng viết đúng như vậy)
          const res: any = await api.public.sheach(params);
          
          // 📦 LOG 2: Kiểm tra toàn bộ phản hồi từ Server
          console.log("%c📦 [SEARCH] API Response (Raw):", "color: orange; font-weight: bold;", res);

          // Xử lý dữ liệu (Tùy vào axios configuration của bạn)
          // Trường hợp 1: Axios trả về object { data: [...], status: 200, ... } -> lấy res.data
          // Trường hợp 2: Interceptor đã xử lý -> res chính là dữ liệu
          // Trường hợp 3: Backend trả về { data: [], pagination: {} } -> cần lấy res.data.data hoặc res.data
          
          let finalData = [];

          if (Array.isArray(res)) {
              finalData = res;
          } else if (Array.isArray(res?.data)) {
              finalData = res.data;
          } else if (Array.isArray(res?.data?.data)) {
              // Một số backend bọc 2 lớp data
              finalData = res.data.data;
          }

          // ✅ LOG 3: Dữ liệu cuối cùng UI nhận được (Phải là Array)
          console.log("%c✅ [SEARCH] Dữ liệu render UI:", "color: green; font-weight: bold;", finalData);

          return finalData;

      } catch (error) {
          // ❌ LOG 4: Bắt lỗi nếu API chết hoặc sai URL
          console.error("❌ [SEARCH] Lỗi API:", error);
          return [];
      }
    },
    enabled: !!query.trim() && isFocused,
    staleTime: 1000 * 60,
  });

  // 4. Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5. Submit Form
  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    
    setIsFocused(false);
    router.push(`search/?search=${encodeURIComponent(text.trim())}`);
  };

  const clearSearch = () => {
    setText("");
    router.push("/home");
  };

  // Helper for images
  const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";
  const getImageUrl = (url: string) => url.startsWith("http") ? url : `${API_DOMAIN.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;

  return (
    <div className="relative w-full max-w-md mx-auto mb-6 z-50" ref={containerRef}>
      
      {/* --- INPUT BAR --- */}
      <form onSubmit={handleSearch} className="relative group">
        <div className={`
            flex items-center w-full px-4 py-2.5 bg-white border rounded-full transition-all duration-200
            ${isFocused ? 'shadow-lg border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 shadow-sm hover:border-gray-300'}
        `}>
          <MagnifyingGlassIcon className={`w-5 h-5 mr-3 transition-colors ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
          
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-[15px]"
            placeholder="Tìm kiếm trên diễn đàn..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />

          {text && (
            <button 
                type="button"
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* --- DROPDOWN RESULTS --- */}
      <AnimatePresence>
        {isFocused && text.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                 <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                 Đang tìm kiếm...
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div>
                <div className="px-4 py-2 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gợi ý bài viết
                </div>
                
                {/* List Results */}
                {searchResults.map((item: IThread) => (
                  <Link 
                    key={item.thread_id}
                    href={`/Thread/${item.category.slug}/${item.slug}`}
                    onClick={() => setIsFocused(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0 group"
                  >
                    {/* Thumbnail */}
                    {/* 👇 FIX: Changed flex-shrink-0 to shrink-0 */}
                    <div className="shrink-0 w-10 h-10 bg-gray-200 rounded-lg overflow-hidden relative">
                        {item.media && item.media.length > 0 ? (
                             <Image 
                                src={getImageUrl(item.media[0].file_url)} 
                                fill 
                                alt="thumb" 
                                className="object-cover"
                             />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <MagnifyingGlassIcon className="w-5 h-5" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-700">
                            {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                            {item.category.name} • Đăng bởi {item.user.lastName}
                        </p>
                    </div>
                  </Link>
                ))}

                {/* Footer: See All */}
                <button
                    onClick={handleSearch}
                    className="w-full text-left px-4 py-3 text-sm text-blue-600 font-medium hover:bg-gray-50 flex items-center gap-2 border-t border-gray-100"
                >
                    <MagnifyingGlassIcon className="w-4 h-4 bg-blue-100 p-0.5 rounded-full" />
                    Xem tất cả kết quả cho "{text}"
                </button>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                Không tìm thấy kết quả nào cho "<strong>{text}</strong>"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}