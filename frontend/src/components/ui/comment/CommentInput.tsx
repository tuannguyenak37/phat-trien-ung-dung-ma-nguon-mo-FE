"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { commentApi } from "@/lib/API/comment";
import { toast } from "sonner"; // Dùng sonner cho đồng bộ
import clsx from "clsx";
import { useAuthStore } from "@/lib/store/tokenStore";
import Image from "next/image";

interface CommentInputProps {
  threadId: string;
  parentCommentId?: string;
  onSuccess?: () => void;
  autoFocus?: boolean;
}

export default function CommentInput({ 
  threadId, 
  parentCommentId, 
  onSuccess,
  autoFocus = false 
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuthStore(); // Lấy user để hiện avatar

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

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
      toast.success(parentCommentId ? "Đã trả lời bình luận!" : "Đã đăng bình luận!");
      
      // Reset height
      if (textareaRef.current) textareaRef.current.style.height = "auto";

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter để gửi (trừ khi giữ Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex gap-3 items-start w-full">
      {/* Avatar người dùng hiện tại */}
      <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden relative border border-gray-100 shadow-sm">
        {user?.url_avatar ? (
           <Image src={user.url_avatar} alt="me" fill className="object-cover" />
        ) : (
           <div className="w-full h-full bg-gray-300" />
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 relative group">
        <textarea
          ref={textareaRef}
          autoFocus={autoFocus}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={parentCommentId ? "Viết câu trả lời..." : "Viết bình luận..."}
          rows={1}
          className={clsx(
  "w-full bg-[#f0f2f5] border-transparent rounded-[20px] px-4 py-2 text-[15px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:bg-gray-100 transition-all resize-none overflow-hidden min-h-[36px]",
)}
          disabled={mutation.isPending}
        />
        
        {/* Nút gửi chỉ hiện khi có nội dung hoặc đang focus */}
        <button
          type="submit"
          disabled={mutation.isPending || !content.trim()}
          className={clsx(
            "absolute bottom-2 right-2 p-1.5 rounded-full transition-all duration-200",
            content.trim() 
              ? "bg-primary text-white hover:bg-primary/90 shadow-md scale-100" 
              : "bg-transparent text-gray-400 cursor-not-allowed scale-90 opacity-0 group-focus-within:opacity-100 group-focus-within:scale-100"
          )}
        >
          {mutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <PaperAirplaneIcon className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
}