"use client";

import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { FireIcon } from "@heroicons/react/24/solid";
import ThreadCard from "./ThreadCard";
import type { IThread, IThreadListResponse } from "@/types/thread";
// Import Type của tham số truyền vào (để TypeScript hiểu)
import type {HomeList} from "@/types/home"

interface Props {
  initialData: IThreadListResponse; // Dữ liệu trang 1
  // THAY ĐỔI QUAN TRỌNG: Nhận hàm gọi API từ props
  fetchData: (params: HomeList) => Promise<any>; 
  
  // Các bộ lọc
  category_id?: string | null;
  tag?: string | null;
  sort_by?: "mix" | "newest" | "trending";
}

export default function InfiniteFeed({ 
  initialData, 
  fetchData,          // Hàm này được truyền từ cha vào (ví dụ: getThreads)
  category_id = null, 
  tag = null,         
  sort_by = "mix"     
}: Props) {
  
  const [threads, setThreads] = useState<IThread[]>(initialData.data || []);
  const [page, setPage] = useState(2);
  const [isLoading, setIsLoading] = useState(false);
  
  // Tính toán hasMore dựa trên initialData
  const [hasMore, setHasMore] = useState(
    (initialData.data?.length || 0) >= (initialData.size || 10)
  );

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  // --- QUAN TRỌNG: RESET KHI PARAM THAY ĐỔI ---
  // Giúp component "chạy luôn" dữ liệu mới khi user đổi từ Tag A sang Tag B
  // hoặc từ Home sang Category mà không cần reload trang
  useEffect(() => {
    setThreads(initialData.data || []);
    setPage(2);
    setHasMore((initialData.data?.length || 0) >= (initialData.size || 10));
    setIsLoading(false);
  }, [initialData]); // Chỉ cần theo dõi initialData (vì cha đã fetch lại khi params đổi)

  // --- HÀM LOAD MORE ---
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      // Gọi hàm fetchData được truyền từ Props
      const res = await fetchData({ 
          page: page, 
          limit: initialData.size || 10,
          sort_by: sort_by,
          category_id: category_id, 
          tag: tag                  
      });

      // Xử lý kết quả trả về
      // Kiểm tra res hoặc res.data tùy cấu trúc trả về của hàm fetchData
      const newThreads = res?.data || res || []; 

      if (newThreads.length > 0) {
        setThreads((prev) => [...prev, ...newThreads]);
        setPage((prev) => prev + 1);

        if (newThreads.length < (initialData.size || 10)) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Lỗi tải thêm:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading, initialData.size, category_id, tag, sort_by, fetchData]);

  // Trigger khi cuộn xuống đáy
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  return (
    <div className="w-full max-w-3xl mx-auto pb-10">
      <div className="flex flex-col gap-6">
        {threads.map((thread) => (
          <ThreadCard key={thread.thread_id} thread={thread} />
        ))}
      </div>

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