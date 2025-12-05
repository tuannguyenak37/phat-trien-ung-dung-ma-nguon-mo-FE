"use client";

import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { FireIcon } from "@heroicons/react/24/solid";

// 1. Import API Service và Component
import api from "@/lib/API/thead"; 
import ThreadCard from "./ThreadCard"; 

// 2. Import Type mới chuẩn chỉnh
import type { IThread, IThreadListResponse } from "@/types/thread"; 

interface Props {
  initialData: IThreadListResponse; // Dữ liệu ban đầu từ Server Side Render (SSR)
}

export default function InfiniteFeed({ initialData }: Props) {
  // State lưu danh sách bài viết
  const [threads, setThreads] = useState<IThread[]>(initialData.data || []);
  
  // State phân trang (Bắt đầu từ trang 2 vì trang 1 đã có ở initialData)
  const [page, setPage] = useState(2);
  
  // State loading & check còn dữ liệu không
  const [isLoading, setIsLoading] = useState(false);
  
  // Logic check hasMore: Nếu mảng ban đầu trả về ít hơn size (limit) -> Hết dữ liệu ngay
  const [hasMore, setHasMore] = useState(
    (initialData.data?.length || 0) >= (initialData.size || 10)
  );

  // Hook detect khi user cuộn xuống cuối
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px", // Trigger sớm trước 200px để trải nghiệm mượt hơn
  });

  // 3. Hàm Load More (Goi API)
  const loadMore = useCallback(async () => {
    // Chặn nếu đang load hoặc đã hết dữ liệu
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      // Gọi API getFeed từ service (Page động, limit lấy theo initialData)
      const res = await api.getFeed({ 
          page: page, 
          limit: initialData.size 
      });

      if (res && res.data && res.data.length > 0) {
        // Nối dữ liệu mới vào
        setThreads((prev) => [...prev, ...res.data]);
        
        // Tăng page
        setPage((prev) => prev + 1);

        // Kiểm tra xem đã hết dữ liệu chưa
        // Nếu số lượng trả về < limit yêu cầu -> Chắc chắn là trang cuối
        if (res.data.length < initialData.size) {
          setHasMore(false);
        }
      } else {
        // Trả về rỗng -> Hết dữ liệu
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading threads:", error);
      // Có thể setHasMore(false) nếu muốn dừng khi lỗi
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, initialData.size]);

  // 4. Trigger khi cuộn xuống
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  return (
    <div className="w-full max-w-3xl mx-auto pb-10">
      {/* Danh sách bài viết */}
      <div className="flex flex-col gap-6">
        {threads.map((thread) => (
          <ThreadCard key={thread.thread_id} thread={thread} />
        ))}
      </div>

      {/* Loading Spinner / End Message */}
      <div ref={ref} className="mt-8 flex justify-center py-6 min-h-[60px]">
        {hasMore ? (
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <FireIcon className="h-6 w-6 text-red-600" />
            <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest">
              {isLoading ? "Đang tải thêm..." : "Cuộn để xem tiếp"}
            </span>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-serif text-xs italic text-gray-400">
              ~ Bạn đã xem hết bài viết ~
            </p>
          </div>
        )}
      </div>
    </div>
  );
}