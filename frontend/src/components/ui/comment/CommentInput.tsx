"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { commentApi } from "@/lib/API/comment";
import { toast } from "sonner";
import clsx from "clsx";
import { useAuthStore } from "@/lib/store/tokenStore";
import Image from "next/image";
import url_bg from "@/utils/url_img";

// Interface thông tin người được trả lời
interface ReplyToUser {
  username?: string;
  full_name?: string;
}

interface CommentInputProps {
  threadId: string;
  parentCommentId?: string;
  onSuccess?: () => void;
  autoFocus?: boolean;
  replyToUser?: ReplyToUser | null; // Nhận thông tin người được reply
}

export default function CommentInput({
  threadId,
  parentCommentId,
  onSuccess,
  autoFocus = false,
  replyToUser,
}: CommentInputProps) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuthStore();

  // --- LOGIC TỰ ĐỘNG TAG TÊN (@User) ---
  useEffect(() => {
    // Chỉ chạy khi có parentCommentId (đang trả lời) và có thông tin user
    if (parentCommentId && replyToUser) {
      const nameToTag = replyToUser.full_name || replyToUser.username || "user";
      
      // Set nội dung: "@Tên " (có dấu cách ở cuối để viết tiếp luôn)
      setContent(`@${nameToTag} `);

      // Tự động focus vào cuối dòng để viết tiếp
      if (textareaRef.current && autoFocus) {
        textareaRef.current.focus();
        // Đặt con trỏ chuột xuống cuối văn bản
        const length = textareaRef.current.value.length; 
        textareaRef.current.setSelectionRange(length, length);
      }
    }
  }, [parentCommentId, replyToUser, autoFocus]);

  // Auto-resize textarea (tự giãn chiều cao khi xuống dòng)
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
      toast.success(
        parentCommentId ? "Đã trả lời bình luận!" : "Đã đăng bình luận!"
      );

      // Reset height về 1 dòng
      if (textareaRef.current) textareaRef.current.style.height = "auto";

      // Làm mới dữ liệu
      if (parentCommentId) {
        queryClient.invalidateQueries({
          queryKey: ["comments", "reply", parentCommentId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["comments", "root", threadId],
        });
      }

      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Lỗi kết nối. Vui lòng thử lại!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    mutation.mutate(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex gap-3 items-start w-full py-2">
      {/* Avatar người dùng hiện tại */}
      <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 overflow-hidden relative border border-gray-100 shadow-sm mt-0.5">
        {user?.url_avatar ? (
          <Image
            src={url_bg(user.url_avatar) || ""}
            alt="me"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-300" />
        )}
      </div>

      {/* Form nhập liệu */}
      <form onSubmit={handleSubmit} className="flex-1 relative group">
        <textarea
          ref={textareaRef}
          autoFocus={autoFocus}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            parentCommentId ? "Viết câu trả lời..." : "Viết bình luận..."
          }
          rows={1}
          className={clsx(
            "w-full bg-[#f0f2f5] border-transparent rounded-[20px] px-4 py-2 text-[15px] text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:bg-gray-100 transition-all resize-none overflow-hidden min-h-9 pr-12",
            // pr-12 để chữ không bị đè lên nút gửi
          )}
          disabled={mutation.isPending}
        />

        {/* Nút gửi (Send Button) */}
        <button
          type="submit"
          disabled={mutation.isPending || !content.trim()}
          className={clsx(
            "absolute bottom-1.5 right-2 p-1.5 rounded-full transition-all duration-200 flex items-center justify-center",
            // LOGIC MÀU SẮC:
            content.trim()
              ? "bg-blue-600 text-white shadow-md hover:bg-blue-700 scale-100" // Có chữ: Xanh đậm, chữ trắng, nổi bật
              : "bg-transparent text-gray-400 cursor-not-allowed opacity-0 group-focus-within:opacity-100 scale-90" // Trống: Ẩn/Mờ
          )}
        >
          {mutation.isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <PaperAirplaneIcon className="w-4 h-4 transform -rotate-45 translate-x-0.5" />
          )}
        </button>
      </form>
    </div>
  );
}