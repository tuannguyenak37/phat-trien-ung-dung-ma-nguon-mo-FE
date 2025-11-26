"use client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getThreads } from "@/lib/hook/getThreads"; // Import hàm ở Bước 1
import ThreadCard from "./ThreadCard"; // Import UI ở Bước 2
import type { Thread, ApiResponse } from "@/types/home"; // Import Interface của bạn
import { FireIcon } from "@heroicons/react/24/solid";
import { useCallback } from "react";

interface Props {
  initialData: ApiResponse;
}

export default function InfiniteFeed({ initialData }: Props) {
  const [threads, setThreads] = useState<Thread[]>(initialData.data);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(
    initialData.data.length < initialData.total
  );

  // 2. Thêm state loading để chặn call liên tục
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView();

  // 3. Bọc hàm loadMore trong useCallback
  const loadMore = useCallback(async () => {
    // Nếu đang load hoặc hết dữ liệu thì chặn luôn
    if (isLoading || !hasMore) return;

    setIsLoading(true); // Khóa lại

    try {
      const res = await getThreads(page, initialData.size);

      if (res && res.data.length > 0) {
        setThreads((prev) => [...prev, ...res.data]);
        setPage((prev) => prev + 1);

        // Logic check hết dữ liệu
        // Nếu số lượng trả về ít hơn size yêu cầu -> chắc chắn là hết
        // Hoặc check tổng
        if (res.data.length < initialData.size) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more:", error);
    } finally {
      setIsLoading(false); // Mở khóa dù thành công hay thất bại
    }
  }, [page, hasMore, isLoading, initialData.size]); // Dependencies của useCallback

  // 4. useEffect giờ an toàn hơn
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);

  return (
    <div className="w-full max-w-3xl mx-auto pb-10">
      <div>
        {threads.map((thread) => (
          <ThreadCard key={thread.thread_id} thread={thread} />
        ))}
      </div>

      <div ref={ref} className="mt-8 flex justify-center py-4">
        {hasMore ? (
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <FireIcon className="h-6 w-6 text-red-600" />
            <span className="text-[10px] font-serif text-red-800 uppercase tracking-widest">
              {isLoading ? "SUMMONING..." : "LOADING MORE..."}
            </span>
          </div>
        ) : (
          <p className="font-serif text-xs italic text-gray-600">
            End of the abyss.
          </p>
        )}
      </div>
    </div>
  );
}
