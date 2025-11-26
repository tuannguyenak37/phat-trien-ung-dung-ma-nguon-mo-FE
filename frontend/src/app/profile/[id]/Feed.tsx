"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import ThreadAPI from "@/lib/API/thead"; // Chú ý: bạn đang để tên file là "thead", nên sửa thành "thread" cho chuẩn
import Image from "next/image";
import ThreadCard from "@/components/ui/ThreadCard";

export default function Feed({ userId }: { userId: string }) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["user-threads", userId],
    queryFn: ({ pageParam }) =>
      ThreadAPI.APIgetThreadById(userId, { page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => {
      // Logic lấy data response
      const responseData = lastPage.data || lastPage;

      // Tính tổng số trang
      const totalPages = Math.ceil(responseData.total / responseData.size);

      if (responseData.page < totalPages) {
        return responseData.page + 1;
      }
      return undefined;
    },
  });

  // --- SỬA Ở ĐÂY: Đưa useEffect lên trên các câu lệnh return ---
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  // -------------------------------------------------------------

  // Bây giờ mới được return sớm
  if (status === "pending") return <div className="p-4 text-center">Loading feed...</div>;
  if (status === "error") return <div className="p-4 text-center text-red-500">Error loading posts</div>;

  return (
    <div className="space-y-6">
      {data?.pages.map((group: any, i) => {
        // Handle data vs axios response
        const posts = group.data?.data || group.data || []; 

        return (
          <div key={i} className="space-y-6">
            {posts.map((post: any) => (
              <ThreadCard key={post.thread_id} thread={post} />
            ))}
          </div>
        );
      })}

      <div ref={ref} className="h-10 flex justify-center items-center mt-4">
        {isFetchingNextPage ? (
          <span className="text-blue-500 text-sm font-medium animate-pulse">
            Loading more...
          </span>
        ) : hasNextPage ? (
          <span className="text-gray-400 text-sm">Scroll for more</span>
        ) : (
          <span className="text-gray-400 text-sm">No more posts</span>
        )}
      </div>
    </div>
  );
}