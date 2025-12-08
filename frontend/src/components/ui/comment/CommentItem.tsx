"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { commentApi } from "@/lib/API/comment";
import userApi from "@/lib/API/user";
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
import url_img from "@/utils/url_img";
import ReputationBadge from "@/utils/ReputationBadge";

// --- TYPES ---
// Export interface này để có thể dùng lại ở nơi khác nếu cần
export interface CommentData {
  comment_id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_comment_id?: string | null;
  upvote_count: number;
  downvote_count: number;
  reply_count: number;
  vote_stats?: { is_voted: number };
  user?: {
    user_id: string;
    firstName: string;
    lastName: string;
    url_avatar: string | null;
    reputation_score?: number;
  };
}

interface CommentItemProps {
  comment: CommentData;
  threadId: string;
  isReply?: boolean;
}

export default function CommentItem({ comment, threadId, isReply = false }: CommentItemProps) {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);

  // --- STATE ---
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [replyInitialValue, setReplyInitialValue] = useState("");

  // --- 1. FETCH USER PROFILE ---
  const { data: profileRes, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["public-profile", comment.user_id],
    queryFn: () => userApi.APIpublic_proflle(comment.user_id),
    enabled: !comment.user && !!comment.user_id,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });

  const fetchedUser = profileRes?.data || profileRes;

  // --- 2. GỘP DỮ LIỆU USER ---
  const author = {
    id: comment.user?.user_id || comment.user_id,
    firstName: comment.user?.firstName || fetchedUser?.firstName || "Người dùng",
    lastName: comment.user?.lastName || fetchedUser?.lastName || "Ẩn danh",
    avatar: comment.user?.url_avatar || fetchedUser?.url_avatar || null,
    reputation: comment.user?.reputation_score ?? fetchedUser?.reputation_score ?? 0,
  };

  const authorFullName = `${author.firstName} ${author.lastName}`;
  const isProfileLoading = !comment.user && isLoadingProfile;

  const canEdit = currentUser?.user_id === author.id;
  const canDelete = currentUser?.user_id === author.id || currentUser?.role === "admin";

  // --- QUERIES & MUTATIONS ---
  const { data: repliesData, isLoading: isLoadingReplies } = useQuery({
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

  const handleReplyClick = () => {
    if (isReplying) {
      setIsReplying(false);
      setReplyInitialValue("");
    } else {
      setIsReplying(true);
      setReplyInitialValue(`@${authorFullName} `);
    }
  };

  return (
    <div className="flex gap-2 group/item w-full mb-3">
      
      {/* 1. AVATAR */}
      <div className="shrink-0">
        <Link href={`/profile/${author.id}`}>
             <div className={clsx(
                 "relative rounded-full overflow-hidden border border-gray-200 shadow-sm hover:brightness-95 transition-all bg-gray-100",
                 isReply ? "w-6 h-6" : "w-8 h-8",
                 isProfileLoading ? "animate-pulse bg-gray-300" : ""
             )}>
                {!isProfileLoading && (
                    <Image 
                        src={url_img(author.avatar) || "/avatar-mac-dinh.jpg"} 
                        alt="avatar" 
                        fill 
                        className="object-cover"
                    />
                )}
             </div>
        </Link>
      </div>

      {/* 2. CONTENT & ACTIONS */}
      <div className="flex-1 min-w-0">
        
        {/* --- BUBBLE --- */}
        <div className="flex items-center gap-2">
            <div className="max-w-full w-full"> {/* Thêm w-full để editor full width */}
                {isEditing ? (
                    <div className="w-full min-w-[300px]">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full bg-white border border-blue-300 rounded-xl p-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-none"
                            rows={3}
                            autoFocus
                        />
                        <div className="flex gap-2 mt-2 justify-end">
                             <button 
                                onClick={() => setIsEditing(false)} 
                                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md font-medium transition-colors"
                             >
                                Hủy
                             </button>
                             {/* Nút LƯU mới: Màu xanh, dễ nhìn */}
                             <button 
                                onClick={() => editMutation.mutate()} 
                                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                disabled={editMutation.isPending}
                             >
                                {editMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                             </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-[#f0f2f5] px-3 py-2 rounded-2xl inline-block relative group/bubble pr-8">
                        
                        {/* HEADER: Tên + Badge Uy Tín */}
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                            <Link href={`/profile/${author.id}`} className="font-bold text-[13px] text-gray-900 hover:underline leading-tight">
                                {isProfileLoading ? "Đang tải..." : authorFullName}
                            </Link>
                            
                            {!isProfileLoading && author.reputation > 0 && (
                                <ReputationBadge score={author.reputation} size="sm" />
                            )}
                        </div>
                        
                        {/* CONTENT: Fix warning break-words */}
                        <p className="text-[15px] text-gray-900 leading-snug whitespace-pre-wrap break-words">
                            {comment.content}
                        </p>
                        
                        {/* Nút 3 chấm */}
                        {(canEdit || canDelete) && (
                            <button 
                                onClick={() => setShowMenu(!showMenu)}
                                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:bg-gray-200 opacity-0 group-hover/bubble:opacity-100 transition-opacity"
                            >
                                <EllipsisHorizontalIcon className="w-5 h-5" />
                            </button>
                        )}
                        
                        {showMenu && (
                             <div className="absolute left-full top-0 ml-2 w-32 bg-white shadow-xl border border-gray-100 rounded-lg z-50 py-1 overflow-hidden">
                                {canEdit && (
                                    <button onClick={() => { setIsEditing(true); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex gap-2 items-center text-gray-700"><PencilIcon className="w-4 h-4"/> Sửa</button>
                                )}
                                {canDelete && (
                                    <button onClick={() => setIsDeleteModalOpen(true)} className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex gap-2 items-center"><TrashIcon className="w-4 h-4"/> Xóa</button>
                                )}
                             </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* --- ACTION BAR --- */}
        {!isEditing && (
            <div className="flex items-center gap-4 mt-1 ml-2 text-[12px] font-semibold text-gray-500 select-none">
                <span className="font-normal hover:underline cursor-pointer" title={comment.created_at}>
                    {formatRelativeTime(comment.created_at)}
                </span>
                
                <div className="scale-90 origin-left -ml-2">
                     <VoteControl 
                        threadId={threadId} 
                        initialUpvotes={comment.upvote_count}
                        initialDownvotes={comment.downvote_count}
                        initialUserVote={comment.vote_stats?.is_voted || 0}
                        isHorizontal={true}
                    />
                </div>

                <button onClick={handleReplyClick} className="hover:underline text-gray-600 cursor-pointer">
                    Trả lời
                </button>
            </div>
        )}

        {/* --- FORM TRẢ LỜI --- */}
        {isReplying && (
            <div className="mt-2 flex gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0 border overflow-hidden mt-1">
                     {currentUser?.url_avatar && <Image src={url_img(currentUser.url_avatar) || "/avatar-mac-dinh.jpg"} width={24} height={24} alt="me" />}
                </div>
                <div className="flex-1">
                    {/* Component con phải hỗ trợ prop initialValue */}
                    <CommentInput 
                        threadId={threadId} 
                        parentCommentId={comment.comment_id}
                        autoFocus={true}
                        // @ts-ignore: Tạm thời ignore nếu file CommentInput chưa cập nhật prop này
                        initialValue={replyInitialValue}
                        onSuccess={() => { 
                            setIsReplying(false); 
                            setShowReplies(true); 
                            setReplyInitialValue("");
                        }} 
                    />
                </div>
            </div>
        )}

        {/* --- VIEW REPLIES LIST --- */}
        {(comment.reply_count > 0 || (repliesData?.data?.length || 0) > 0) && (
            <div className="mt-1">
                {!showReplies ? (
                    <button onClick={() => setShowReplies(true)} className="text-[13px] font-bold text-gray-500 hover:underline flex items-center gap-2 ml-1 mt-1">
                        <div className="w-6 h-px bg-gray-300"></div> 
                        Xem {comment.reply_count} câu trả lời
                    </button>
                ) : (
                    <div className="space-y-1 pt-2 pl-2 border-l-2 border-gray-100 ml-3">
                        {isLoadingReplies && <div className="text-xs text-gray-400 pl-2 py-1">Đang tải phản hồi...</div>}
                        
                        {/* FIX: Ép kiểu dữ liệu để tránh lỗi TypeScript */}
                        {(repliesData?.data as CommentData[])?.map((reply) => (
                            <CommentItem 
                                key={reply.comment_id} 
                                comment={reply} 
                                threadId={threadId} 
                                isReply={true} 
                            />
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>

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