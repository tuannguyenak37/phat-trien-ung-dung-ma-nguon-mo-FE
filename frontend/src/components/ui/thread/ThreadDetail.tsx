"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ShareIcon, EllipsisHorizontalIcon, ChevronLeftIcon, FlagIcon,
  TrashIcon, ChevronRightIcon, XMarkIcon
} from "@heroicons/react/24/outline";

// Components
import VoteControl from "../VoteControl";
import UserThead from "../userthead";
import CommentSection from "../comment/CommentSection";
import api from "@/lib/API/thead";
import type { IThread } from "@/types/thread";

const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";
const getImageUrl = (url: string) => url.startsWith("http") ? url : `${API_DOMAIN.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;

export default function ThreadDetail({ initialData }: { initialData: IThread }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // --- 1. SETUP DATA ---
  const { data: thread } = useQuery({
    queryKey: ['thread', initialData.thread_id],
    queryFn: async () => {
        const response: any = await api.public.getById(initialData.thread_id);
        return response.data || response;
    },
    initialData: initialData,
  });

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user_info") : null;
      if (userStr) setCurrentUser(JSON.parse(userStr));
  }, []);

  const isOwner = currentUser?.user_id === thread?.user.user_id;
  const hasMedia = thread.media && thread.media.length > 0;

  // --- 2. ACTIONS ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(id),
    onSuccess: () => {
        toast.success("Đã xóa bài viết");
        queryClient.invalidateQueries({ queryKey: ['feed'] });
        router.push("/");
    },
  });

  const nextMedia = () => hasMedia && setCurrentMediaIndex((prev) => (prev + 1) % thread.media.length);
  const prevMedia = () => hasMedia && setCurrentMediaIndex((prev) => (prev - 1 + thread.media.length) % thread.media.length);

  // --- 3. LAYOUT LOGIC (ĐÃ SỬA LẠI CHO KHỚP VỚI PAGE.TSX) ---
  
  // SỬA 1: Dùng h-full thay vì 100dvh. Vì cha (main) đã lo việc set chiều cao rồi.
  const containerClasses = hasMedia 
    ? "flex flex-col lg:flex-row w-full h-full bg-black overflow-hidden" 
    : "w-full h-full bg-[#F0F2F5] flex justify-center overflow-hidden"; // Thêm overflow-hidden để ép scroll vào cột con

  // SỬA 2: Cột nội dung luôn có overflow-y-auto để scroll độc lập
  const contentColumnClasses = hasMedia
    ? "flex flex-col bg-white h-full lg:w-[35%] xl:w-[30%] w-full flex-1 relative min-h-0"
    : "flex flex-col bg-white w-full max-w-[700px] h-full md:my-0 md:rounded-none shadow-sm relative min-h-0"; 
    // Lưu ý: Mode không media tôi cũng để h-full và scroll bên trong để tránh lỗi layout với header cha

  return (
    <div className={containerClasses}>
      
      {/* A. MEDIA LEFT (Chỉ hiện khi có media) */}
      {hasMedia && (
        <div className="relative flex items-center justify-center bg-black lg:h-full lg:w-[65%] xl:w-[70%] h-[40vh] border-r border-gray-800 shrink-0">
            {/* Back Button Mobile */}
            <button onClick={() => router.back()} className="absolute top-4 left-4 z-20 p-2 bg-black/50 text-white rounded-full lg:hidden backdrop-blur-sm">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>

            {/* Viewer */}
            <div className="relative w-full h-full flex items-center justify-center p-0 lg:p-4">
                {thread.media[currentMediaIndex].media_type === 'image' ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                        src={getImageUrl(thread.media[currentMediaIndex].file_url)} 
                        alt="Media"
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <video 
                        src={getImageUrl(thread.media[currentMediaIndex].file_url)} 
                        controls autoPlay className="w-full h-full object-contain"
                    />
                )}
                {/* Nav */}
                {thread.media.length > 1 && (
                    <>
                        <button onClick={prevMedia} className="absolute left-2 lg:left-4 p-2 lg:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"><ChevronLeftIcon className="w-6 h-6"/></button>
                        <button onClick={nextMedia} className="absolute right-2 lg:right-4 p-2 lg:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md"><ChevronRightIcon className="w-6 h-6"/></button>
                    </>
                )}
            </div>
        </div>
      )}

      {/* B. CONTENT COLUMN (RIGHT/CENTER) */}
      <div className={contentColumnClasses}>
        
        {/* HEADER (Sticky) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white z-20 shrink-0 sticky top-0">
            <div className="flex items-center gap-3">
                <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-900 mr-1 p-1 rounded-full hover:bg-gray-100">
                    {hasMedia ? <XMarkIcon className="w-6 h-6" /> : <ChevronLeftIcon className="w-6 h-6" />}
                </button>
                <UserThead id={thread.user.user_id} />
                <span className="text-xs text-gray-500">{new Date(thread.created_at).toLocaleDateString('vi-VN')}</span>
            </div>
            
            <div className="relative">
                <button onClick={() => setShowOptionsMenu(!showOptionsMenu)} className="p-2 hover:bg-gray-100 rounded-full">
                    <EllipsisHorizontalIcon className="w-6 h-6 text-gray-600"/>
                </button>
                {/* Menu Dropdown Logic Here... */}
                 {showOptionsMenu && (
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl border rounded-lg z-50 py-1">
                      {isOwner ? (
                         <button onClick={() => deleteMutation.mutate(thread.thread_id)} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm flex gap-2">
                            <TrashIcon className="w-4 h-4"/> Xóa bài viết
                         </button>
                      ) : (
                         <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm flex gap-2">
                            <FlagIcon className="w-4 h-4"/> Báo cáo
                         </button>
                      )}
                   </div>
                )}
            </div>
        </div>

        {/* SCROLLABLE CONTENT BODY */}
        {/* Đây là khu vực cuộn chính: flex-1 + overflow-y-auto */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
            <div className="p-4 pb-0">
                <h1 className="text-xl font-bold mb-3">{thread.title}</h1>
                <div className="prose prose-base max-w-none break-words whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: thread.content }} />
                
                {/* Tags */}
                {thread.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {thread.tags.map((tag: any, i: number) => (
                            <span key={i} className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-sm font-medium">#{tag.name}</span>
                        ))}
                    </div>
                )}

                {/* Stats */}
                <div className="flex justify-between mt-6 text-sm text-gray-500 py-2 border-b border-gray-100">
                    <span>{thread.upvote_count} thích</span>
                    <span>{thread.comment_count} bình luận</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-around py-2 border-b border-gray-100">
                 <VoteControl 
                    threadId={thread.thread_id}
                    initialUpvotes={thread.upvote_count}
                    initialDownvotes={thread.downvote_count}
                    initialUserVote={thread.vote_stats?.is_voted || 0}
                    isHorizontal={true}
                 />
                 <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-6 py-2 rounded-lg text-sm font-medium">
                    <ShareIcon className="w-5 h-5"/> Chia sẻ
                 </button>
            </div>

            {/* COMMENTS SECTION */}
            {/* Thêm nhiều padding bottom để dễ scroll thấy comment cuối */}
            <div className="p-4 pb-24">
                 <CommentSection 
                    threadId={thread.thread_id} 
                    commentCount={thread.comment_count} 
                 />
            </div>
        </div>

      </div>
    </div>
  );
}