"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import ThreadAPI from "@/lib/API/thead";
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
      const responseData = lastPage.data || lastPage;
      const totalPages = Math.ceil(responseData.total / responseData.size);
      return responseData.page < totalPages
        ? responseData.page + 1
        : undefined;
    },
  });

  // Auto load khi scroll
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  // Loading / Error UI
  if (status === "pending")
    return (
      <div className="p-6 text-center text-slate-600 text-sm animate-pulse">
        Đang tải bài viết...
      </div>
    );

  if (status === "error")
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        Không thể tải dữ liệu
      </div>
    );

  return (
    <div className="space-y-6">
      {data?.pages.map((group: any, i) => {
        const posts = group.data?.data || group.data || [];

        return (
          <div key={i} className="space-y-6">
            {posts.map((post: any) => (
              <ThreadCard key={post.thread_id} thread={post} />
            ))}
          </div>
        );
      })}

      {/* Load More Indicator */}
      <div
        ref={ref}
        className="h-12 flex justify-center items-center mt-2 text-sm"
      >
        {isFetchingNextPage ? (
          <span className="text-blue-500 font-medium animate-pulse">
            Đang tải thêm...
          </span>
        ) : hasNextPage ? (
          <span className="text-slate-400">Kéo xuống để tiếp tục</span>
        ) : (
          <span className="text-slate-400">Đã hết bài viết</span>
        )}
      </div>
    </div>
  );
}
