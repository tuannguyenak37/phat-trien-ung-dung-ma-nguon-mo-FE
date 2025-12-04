"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/lib/API/comment";
import { Comment } from "@/types/comment";
import { formatRelativeTime } from "@/utils/formatdate";
import VoteControl from "../VoteControl";
import CommentInput from "./CommentInput";
import { useAuthStore } from "@/lib/store/tokenStore";
import { EllipsisHorizontalIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import ConfirmModal from "@/utils/ConfirmModal";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

// --- HELPERS ---
const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";
const getAvatarUrl = (url?: string | null) => {
    if (!url) return "/avatar-mac-dinh.jpg"; // Đường dẫn ảnh mặc định
    if (url.startsWith("http")) return url;
    return `${API_DOMAIN}/${url.replace(/^\//, "")}`;
};

interface CommentItemProps {
  comment: Comment;
  threadId: string;
  isReply?: boolean; // Để xác định kích thước avatar
}

export default function CommentItem({ comment, threadId, isReply = false }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  
  const canEdit = currentUser?.user_id === comment.user_id;
  const canDelete = currentUser?.user_id === comment.user_id || currentUser?.role === "admin";

  const { data: repliesData, isLoading } = useQuery({
    queryKey: ["comments", "reply", comment.comment_id],
    queryFn: () => commentApi.getComments({ parent_comment_id: comment.comment_id, limit: 10 }),
    enabled: showReplies,
  });

  const editMutation = useMutation({
    mutationFn: () => commentApi.updateComment(comment.comment_id, editContent),
    onSuccess: () => {
      setIsEditing(false);
      setShowMenu(false);
      toast.success("Đã cập nhật!");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => commentApi.deleteComment(comment.comment_id),
    onSuccess: () => {
      toast.success("Đã xóa!");
      setIsDeleteModalOpen(false);
      if (comment.parent_comment_id) {
        queryClient.invalidateQueries({ queryKey: ["comments", "reply", comment.parent_comment_id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments", "root", threadId] });
      }
    },
  });

  return (
    <div className="flex gap-2 group/item w-full">
      {/* 1. AVATAR */}
      <div className="shrink-0">
        <Link href={`/profile/${comment.user_id}`}>
             <div className={clsx(
                 "relative rounded-full overflow-hidden border border-gray-200 shadow-sm hover:brightness-95 transition-all",
                 isReply ? "w-6 h-6" : "w-8 h-8" // Reply thì avatar nhỏ hơn chút giống FB
             )}>
                <Image 
                    src={getAvatarUrl(comment.url_avatar)} 
                    alt="avatar" 
                    fill 
                    className="object-cover"
                />
             </div>
        </Link>
      </div>

      {/* 2. CONTENT & ACTIONS */}
      <div className="flex-1 min-w-0">
        
        {/* --- KHỐI BUBBLE & EDIT --- */}
        <div className="flex items-center gap-2">
            <div className="max-w-full">
                {isEditing ? (
                    <div className="w-full min-w-[300px]">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                            rows={2}
                            autoFocus
                        />
                        <div className="flex gap-2 mt-1 text-xs">
                             <button onClick={() => setIsEditing(false)} className="text-blue-500 hover:underline">Hủy</button>
                             <button onClick={() => editMutation.mutate()} className="text-blue-500 hover:underline font-bold" disabled={editMutation.isPending}>Lưu</button>
                        </div>
                    </div>
                ) : (
                    // ✨ STYLE FACEBOOK: Bubble chứa cả Tên và Nội dung
                    <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl inline-block relative group/bubble">
                        <Link href={`/profile/${comment.user_id}`} className="font-bold text-[13px] text-gray-900 hover:underline block leading-tight">
                            {comment.firstName} {comment.lastName}
                        </Link>
                        <p className="text-[15px] text-gray-900 leading-normal whitespace-pre-wrap break-words">
                            {comment.content}
                        </p>
                        
                        {/* Menu 3 chấm (Chỉ hiện khi hover vào bubble hoặc trên mobile) */}
                        {(canEdit || canDelete) && (
                            <button 
                                onClick={() => setShowMenu(!showMenu)}
                                className="absolute -right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-500 hover:bg-gray-100 opacity-0 group-hover/bubble:opacity-100 transition-opacity"
                            >
                                <EllipsisHorizontalIcon className="w-5 h-5" />
                            </button>
                        )}
                        
                        {/* Dropdown Menu */}
                        {showMenu && (
                             <div className="absolute left-full top-0 ml-2 w-32 bg-white shadow-xl border border-gray-100 rounded-lg z-50 py-1">
                                {canEdit && (
                                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex gap-2"><PencilIcon className="w-4 h-4"/> Sửa</button>
                                )}
                                {canDelete && (
                                    <button onClick={() => setIsDeleteModalOpen(true)} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex gap-2"><TrashIcon className="w-4 h-4"/> Xóa</button>
                                )}
                             </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* --- ACTION BAR (Dưới Bubble) --- */}
        {!isEditing && (
            <div className="flex items-center gap-3 mt-0.5 ml-1 text-[12px] font-semibold text-gray-500">
                {/* Thời gian */}
                <span className="font-normal hover:underline cursor-pointer">
                    {formatRelativeTime(comment.created_at)}
                </span>
                
                {/* Like/Vote */}
                <div className="scale-90 origin-left">
                     <VoteControl 
                        commentId={comment.comment_id}
                        initialUpvotes={comment.upvote_count}
                        initialDownvotes={comment.downvote_count}
                        initialUserVote={comment.vote_stats?.is_voted || 0}
                        isHorizontal={true}
                        hideCountIfZero={true} // Tùy chọn ẩn số 0 cho gọn
                    />
                </div>

                {/* Nút Reply */}
                <button 
                    onClick={() => setIsReplying(!isReplying)}
                    className="hover:underline text-gray-600"
                >
                    Trả lời
                </button>
            </div>
        )}

        {/* --- FORM TRẢ LỜI --- */}
        {isReplying && (
            <div className="mt-2 flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0 border overflow-hidden">
                     {/* Avatar người đang đăng nhập (nhỏ) */}
                     {currentUser?.url_avatar && <Image src={currentUser.url_avatar} width={24} height={24} alt="me" />}
                </div>
                <div className="flex-1">
                    <CommentInput 
                        threadId={threadId} 
                        parentCommentId={comment.comment_id}
                        autoFocus={true}
                        onSuccess={() => { setIsReplying(false); setShowReplies(true); }} 
                    />
                </div>
            </div>
        )}

        {/* --- VIEW REPLIES --- */}
        {(comment.reply_count > 0 || (repliesData?.data?.length || 0) > 0) && (
            <div className="mt-1">
                {!showReplies ? (
                    <button 
                        onClick={() => setShowReplies(true)}
                        className="text-[13px] font-bold text-gray-500 hover:underline flex items-center gap-2 ml-1"
                    >
                        <div className="w-5 h-[1px] bg-gray-300"></div> {/* Đường kẻ ngang giống FB */}
                        Xem {comment.reply_count} câu trả lời
                    </button>
                ) : (
                    <div className="space-y-3 pt-2">
                        {isLoading && <div className="text-xs text-gray-400 pl-2">Đang tải...</div>}
                        {repliesData?.data.map((reply) => (
                            // Gọi đệ quy, set isReply=true để avatar nhỏ đi
                            <CommentItem key={reply.comment_id} comment={reply} threadId={threadId} isReply={true} />
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Xóa bình luận?"
        message="Bạn có chắc chắn muốn xóa bình luận này?"
        isDanger={true}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}