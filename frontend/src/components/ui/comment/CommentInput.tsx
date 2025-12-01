"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { commentApi } from "@/lib/API/comment";
import toast from "react-hot-toast";
import clsx from "clsx";

interface CommentInputProps {
  threadId: string;
  parentCommentId?: string;
  onSuccess?: () => void;
  // 👇 THÊM DÒNG NÀY ĐỂ SỬA LỖI
  autoFocus?: boolean; 
}

export default function CommentInput({ 
  threadId, 
  parentCommentId, 
  onSuccess,
  // 👇 Nhận prop autoFocus (mặc định là false)
  autoFocus = false 
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (text: string) => {
      return await commentApi.createComment({
        thread_id: threadId,
        content: text,
        parent_comment_id: parentCommentId,
      });
    },
    onSuccess: () => {
      setContent("");
      toast.success(parentCommentId ? "Đã trả lời!" : "Đã bình luận!");

      if (parentCommentId) {
        queryClient.invalidateQueries({ queryKey: ["comments", "reply", parentCommentId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments", "root", threadId] });
      }

      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Không thể gửi bình luận. Vui lòng thử lại!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutation.mutate(content);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-start w-full">
      {/* Avatar giả lập */}
      <div className="w-8 h-8 rounded-full bg-zinc-700 shrink-0 border border-white/10" />

      <div className="flex-1 relative">
        <textarea
          // 👇 Truyền autoFocus vào thẻ textarea ở đây
          autoFocus={autoFocus} 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentCommentId ? "Viết câu trả lời..." : "Viết bình luận..."}
          className={clsx(
            "w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-sm text-gray-200 placeholder-zinc-500 focus:outline-none focus:border-red-500 min-h-[42px] resize-none overflow-hidden transition-all",
            content.length > 0 ? "min-h-[80px]" : "h-[46px]"
          )}
          disabled={mutation.isPending}
        />
        
        <button
          type="submit"
          disabled={mutation.isPending || !content.trim()}
          className={clsx(
            "absolute bottom-3 right-3 p-1.5 rounded-full transition-all",
            content.trim() 
              ? "bg-red-600 text-white hover:bg-red-500" 
              : "bg-zinc-700 text-zinc-500 cursor-not-allowed"
          )}
        >
          {mutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <PaperAirplaneIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </form>
  );
}