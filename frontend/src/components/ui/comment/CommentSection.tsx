"use client";
import { useQuery } from "@tanstack/react-query";
import { commentApi } from "@/lib/API/comment";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";

interface CommentSectionProps {
  threadId: string;
  commentCount: number; // Lấy từ thread detail để hiện tổng số
}

export default function CommentSection({ threadId, commentCount }: CommentSectionProps) {
  // Lấy danh sách comment gốc (cấp 1)
  const { data, isLoading } = useQuery({
    queryKey: ["comments", "root", threadId],
    queryFn: () => commentApi.getComments({ thread_id: threadId, page: 1, limit: 10 }),
  });

  return (
    <div className="mt-8 pt-6 border-t border-zinc-800">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        Bình luận <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-xs">{commentCount}</span>
      </h3>

      {/* Form nhập comment chính */}
      <div className="mb-8">
        <CommentInput threadId={threadId} />
      </div>

      {/* Danh sách Comment */}
      <div className="space-y-6">
        {isLoading ? (
           <div className="text-center text-zinc-500 py-10">Đang tải bình luận...</div>
        ) : (
           data?.data.map((comment) => (
             <CommentItem key={comment.comment_id} comment={comment} threadId={threadId} />
           ))
        )}
        
        {/* Nút Load more (Nếu cần) */}
        {(data?.total || 0) > 10 && (
            <button className="w-full py-3 text-sm text-zinc-500 hover:text-white bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors">
                Xem thêm bình luận
            </button>
        )}
      </div>
    </div>
  );
}