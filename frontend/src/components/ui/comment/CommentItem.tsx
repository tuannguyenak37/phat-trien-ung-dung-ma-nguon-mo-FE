"use client";

import { useState } from "react";



import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";



import { commentApi } from "@/lib/API/comment";



import { Comment } from "@/types/comment";



import { formatRelativeTime } from "@/utils/formatdate";



import UserThead from "../userthead";



import VoteControl from "../VoteControl";



import CommentInput from "./CommentInput";



import { useAuthStore } from "@/lib/store/tokenStore"; // Lấy user hiện tại để check quyền



import { EllipsisHorizontalIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";


import ConfirmModal from "@/utils/ConfirmModal"; // Import Modal
import toast from "react-hot-toast";


interface CommentItemProps {
  comment: Comment;
  threadId: string;
}

export default function CommentItem({ comment, threadId }: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  
  // State Edit/Delete
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
      toast.success("Đã cập nhật bình luận!");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: () => toast.error("Lỗi khi cập nhật!"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => commentApi.deleteComment(comment.comment_id),
    onSuccess: () => {
      toast.success("Đã xóa bình luận!");
      setIsDeleteModalOpen(false);
      if (comment.parent_comment_id) {
        queryClient.invalidateQueries({ queryKey: ["comments", "reply", comment.parent_comment_id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments", "root", threadId] });
      }
    },
    onError: () => {
        toast.error("Lỗi khi xóa!");
        setIsDeleteModalOpen(false);
    }
  });

  return (
    <div className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300 group/item">
      {/* Avatar */}
      <div className="shrink-0 pt-1">
         <div className="scale-90 origin-top-left">
            <UserThead id={comment.user_id} />
         </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="group relative">
            
            {isEditing ? (
                <div className="w-full">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:border-red-500 min-h-[80px]"
                        autoFocus
                    />
                    <div className="flex gap-2 mt-2 justify-end">
                        <button onClick={() => { setIsEditing(false); setEditContent(comment.content); }} className="text-xs text-zinc-400 hover:text-white px-3 py-1.5">Hủy</button>
                        <button onClick={() => editMutation.mutate()} disabled={editMutation.isPending || !editContent.trim()} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-500 disabled:opacity-50">
                            {editMutation.isPending ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-800/40 px-3 py-2 rounded-2xl rounded-tl-none border border-white/5 inline-block pr-4 relative">
                    <p className="text-sm text-gray-200 whitespace-pre-wrap break-words mt-1">
                        {comment.content}
                    </p>
                </div>
            )}
        </div>

        {/* --- ACTION BAR (SỬA LẠI VỊ TRÍ NÚT 3 CHẤM) --- */}
        {!isEditing && (
            <div className="flex items-center gap-4 mt-1 ml-1 relative min-h-[24px]">
                {/* 1. Thời gian */}
                <span className="text-[11px] text-zinc-500 font-medium">
                    {formatRelativeTime(comment.created_at)}
                    {comment.updated_at && comment.updated_at !== comment.created_at && (
                        <span className="ml-1 italic text-zinc-600"></span>
                    )}
                </span>

                {/* 2. Nút Trả lời */}
                <button 
                    onClick={() => setIsReplying(!isReplying)}
                    className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors"
                >
                    Trả lời
                </button>

                {/* 3. Vote Control */}
                <div className="scale-75 origin-left flex items-center">
                    <VoteControl 
                        commentId={comment.comment_id}
                        initialUpvotes={comment.upvote_count}
                        initialDownvotes={comment.downvote_count}
                        initialUserVote={comment.vote_stats?.is_voted || 0}
                        isHorizontal={true}
                    />
                </div>

                {/* 4. MENU 3 CHẤM (ĐẶT NGAY ĐÂY, KHÔNG DÙNG ml-auto) */}
                {(canEdit || canDelete) && (
                    <div className="relative"> 
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            // 👇 Bỏ opacity-0, thay bằng text tối màu để dễ thấy trên mobile
                            className="p-1 rounded-full text-zinc-600 hover:text-white hover:bg-zinc-800 transition-colors"
                            title="Tùy chọn"
                        >
                            <EllipsisHorizontalIcon className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {showMenu && (
                            <div className="absolute left-0 top-full mt-1 w-32 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                                {canEdit && (
                                    <button 
                                        onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                        className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2"
                                    >
                                        <PencilIcon className="w-3.5 h-3.5" /> Sửa
                                    </button>
                                )}
                                {canDelete && (
                                    <button 
                                        onClick={() => { setShowMenu(false); setIsDeleteModalOpen(true); }}
                                        className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 hover:text-red-300 flex items-center gap-2"
                                    >
                                        <TrashIcon className="w-3.5 h-3.5" /> Xóa
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        )}

        {/* Form nhập Reply */}
        {isReplying && (
            <div className="mt-3 pl-2 border-l-2 border-zinc-700 animate-in slide-in-from-top-2">
                <CommentInput 
                    threadId={threadId} 
                    parentCommentId={comment.comment_id}
                    autoFocus={true}
                    onSuccess={() => { setIsReplying(false); setShowReplies(true); }} 
                />
            </div>
        )}

        {/* Nút Xem/Ẩn Reply */}
        {(comment.reply_count > 0 || (repliesData?.data?.length || 0) > 0) && (
            <button 
                onClick={() => setShowReplies(!showReplies)}
                className="mt-2 text-xs font-semibold text-zinc-500 hover:text-white flex items-center gap-2 group"
            >
                <div className="w-8 h-[1px] bg-zinc-700 group-hover:bg-zinc-500 transition-colors"></div>
                {showReplies ? "Ẩn phản hồi" : `Xem ${comment.reply_count} câu trả lời`}
            </button>
        )}

        {/* Danh sách Reply */}
        {showReplies && (
            <div className="mt-3 pl-4 border-l border-zinc-800/50 space-y-4">
                {isLoading && <div className="text-xs text-zinc-500 pl-2 animate-pulse">Đang tải phản hồi...</div>}
                {repliesData?.data.map((reply) => (
                    <CommentItem key={reply.comment_id} comment={reply} threadId={threadId} />
                ))}
            </div>
        )}
      </div>
      
      {showMenu && <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>}

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Xóa bình luận?"
        message="Hành động này không thể hoàn tác."
        isDanger={true}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}