"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Components
import VoteControl from "./VoteControl"; 
import UserThead from "./userthead";
import EditThreadModal from "./thread/EditThreadModal"; 
import ConfirmModal from "@/utils/ConfirmModal"; // 👈 IMPORT MODAL XÁC NHẬN

// Icons
import {
  ChatBubbleLeftIcon, ShareIcon, EllipsisHorizontalIcon,
  LinkIcon, FlagIcon, PencilSquareIcon, TrashIcon
} from "@heroicons/react/24/outline";

// API & Types
import api from "@/lib/API/thead"; 
import type { IThread, IThreadMedia } from "@/types/thread";
import { useAuthStore } from "@/lib/store/tokenStore"; 

const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";

// --- HELPERS ---
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return "Vừa xong";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays <= 7) return `${diffInDays} ngày`;
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
};

// Modal Xem Ảnh Full
const ImageGalleryModal = ({ images, initialIndex, onClose }: { images: IThreadMedia[]; initialIndex: number; onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const getImageUrl = (url: string) => url.startsWith("http") ? url : `${API_DOMAIN.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev + 1) % images.length);
            if (e.key === "ArrowLeft") setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [images.length, onClose]);

    return (
        <div onClick={onClose} className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm cursor-zoom-out p-4">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={getImageUrl(images[currentIndex].file_url)} className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl cursor-default" onClick={(e) => e.stopPropagation()} alt="full" />
        </div>
    )
};

// =================================================================
// MAIN COMPONENT
// =================================================================
export default function ThreadCard({ thread }: { thread: IThread }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: userStore } = useAuthStore(); 

  // --- STATE ---
  const [isOwner, setIsOwner] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // State Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 👈 State Modal Xóa

  // --- REFS ---
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) setShowShareMenu(false);
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) setShowOptionsMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check Owner (Fix F5 refresh)
  useEffect(() => {
      let currentUserId = userStore?.user_id;
      if (!currentUserId && typeof window !== 'undefined') {
          const userStr = localStorage.getItem("user_info");
          if (userStr) {
              try { currentUserId = JSON.parse(userStr).user_id; } catch {}
          }
      }
      setIsOwner(String(currentUserId) === String(thread.user.user_id));
  }, [userStore, thread.user.user_id]);

  // --- HELPERS ---
  const detailPath = `/Thread/${thread.category.slug}/${thread.slug}`;
  const mediaList = thread.media || [];
  const count = mediaList.length;
  const getImageUrl = (url: string) => url.startsWith("http") ? url : `${API_DOMAIN.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
  
  const handleNavigateDetail = () => router.push(detailPath);

  // --- ACTIONS ---
  
  // 1. Delete Logic
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(id),
    onSuccess: () => {
        toast.success("Đã xóa bài viết");
        queryClient.invalidateQueries({ queryKey: ["feed"] });
        setIsDeleteModalOpen(false);
    },
    onError: () => {
        toast.error("Có lỗi xảy ra khi xóa");
        setIsDeleteModalOpen(false);
    },
  });

  const handleDeleteClick = () => {
    setShowOptionsMenu(false);
    setIsDeleteModalOpen(true); // Mở modal xác nhận thay vì window.confirm
  };

  // 2. Edit Logic
  const handleEditClick = () => {
    setShowOptionsMenu(false);
    setIsEditModalOpen(true);
  };

  // 3. Share Logic
  const handleCopyLink = () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${detailPath}` : '';
    navigator.clipboard.writeText(url).then(() => toast.success("Đã sao chép liên kết!"));
    setShowShareMenu(false);
  };

  // --- UI GRID LAYOUT ---
  const getGridClass = () => {
    if (count === 1) return "grid-cols-1 aspect-video";
    if (count === 2) return "grid-cols-2 aspect-video";
    if (count === 3) return "grid-cols-2 aspect-[4/3]";
    if (count >= 4) return "grid-cols-2 aspect-square";
    return "";
  };

  return (
    <>
      <div className="group mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all relative z-0">
        
        {/* HEADER */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleNavigateDetail}>
            <UserThead id={thread.user.user_id} /> 
            <div className="text-xs text-gray-500 flex items-center gap-1.5">
               <Link href={`/Thread/categories/${thread.category.slug}`} className="font-semibold text-blue-600 hover:underline" onClick={e => e.stopPropagation()}>
                 {thread.category.name}
               </Link>
               <span className="w-1 h-1 rounded-full bg-gray-300"></span>
               <span>{formatRelativeTime(thread.created_at)}</span>
            </div>
          </div>

          {/* OPTIONS MENU (3 CHẤM) */}
          <div className="relative" ref={optionsMenuRef}>
            <button 
                onClick={(e) => { e.stopPropagation(); setShowOptionsMenu(!showOptionsMenu); }}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
            >
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {showOptionsMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-20 origin-top-right min-w-[120px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {isOwner ? (
                            // 👇 UI MỚI: Chỉ hiện Icon cho Sửa/Xóa
                            <div className="flex items-center justify-around gap-1 p-1">
                                <button 
                                    onClick={handleEditClick} 
                                    title="Chỉnh sửa bài viết"
                                    className="flex-1 flex items-center justify-center p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors tooltip-trigger"
                                >
                                    <PencilSquareIcon className="w-5 h-5" />
                                </button>
                                <div className="w-px h-5 bg-gray-200"></div> {/* Đường ngăn cách */}
                                <button 
                                    onClick={handleDeleteClick} 
                                    title="Xóa bài viết"
                                    className="flex-1 flex items-center justify-center p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                                <FlagIcon className="w-4 h-4" /> Báo cáo
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mb-3 cursor-pointer" onClick={handleNavigateDetail}>
          {thread.title && <h3 className="text-lg font-bold text-gray-900 mb-1.5 leading-snug hover:text-blue-600 transition-colors">{thread.title}</h3>}
          {thread.content && (
            <div className="text-[15px] text-gray-700 whitespace-pre-line leading-relaxed line-clamp-3">
               {/* Nếu content là HTML thì dùng dangerouslySetInnerHTML, nếu plain text thì render trực tiếp */}
               <span dangerouslySetInnerHTML={{ __html: thread.content }} />
            </div>
          )}
        </div>

        {/* TAGS */}
        {thread.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {thread.tags.map((tag, idx) => (
                <span key={idx} className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
                  #{tag.name}
                </span>
            ))}
          </div>
        )}

        {/* MEDIA GRID */}
        {count > 0 && (
          <div className={`mb-4 grid gap-1 overflow-hidden rounded-xl ${getGridClass()}`}>
            {mediaList.slice(0, 4).map((media, index) => {
              const remaining = count - 4;
              return (
                <div 
                    key={media.media_id || index} 
                    onClick={(e) => { e.stopPropagation(); setGalleryIndex(index); setGalleryOpen(true); }} 
                    className={`relative bg-gray-100 cursor-pointer group/img overflow-hidden h-full w-full ${(count === 3 && index === 0) ? "row-span-2" : ""}`}
                >
                  <Image src={getImageUrl(media.file_url)} alt="media" fill className="object-cover transition-transform duration-700 group-hover/img:scale-105" />
                  {index === 3 && remaining > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 transition-colors backdrop-blur-[1px]">
                      <span className="text-2xl font-bold text-white drop-shadow-md">+{remaining}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100">
          <div className="flex gap-1 items-center">
            <div className="mr-3">
                <VoteControl
                  threadId={thread.thread_id}
                  initialUpvotes={thread.upvote_count || 0}
                  initialDownvotes={thread.downvote_count || 0}
                  initialUserVote={thread.vote_stats?.is_voted || 0}
                  isHorizontal={true}
                />
            </div>
            <button onClick={handleNavigateDetail} className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-gray-500 hover:text-blue-600 hover:bg-blue-50 group">
              <ChatBubbleLeftIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">{thread.comment_count > 0 ? `${thread.comment_count} Thảo luận` : "Thảo luận"}</span>
            </button>
          </div>

          <div className="relative" ref={shareMenuRef}>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowShareMenu(!showShareMenu); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
              >
                <ShareIcon className="w-5 h-5" />
                <span className="text-xs hidden sm:inline font-medium">Chia sẻ</span>
              </button>

              <AnimatePresence>
                {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-20 origin-bottom-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={handleCopyLink} className="flex w-full items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors text-left">
                         <LinkIcon className="w-5 h-5 text-gray-500" /> Sao chép link
                      </button>
                    </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      <AnimatePresence>
        {galleryOpen && <ImageGalleryModal images={mediaList} initialIndex={galleryIndex} onClose={() => setGalleryOpen(false)} />}
      </AnimatePresence>

      {/* Modal Sửa */}
      {isEditModalOpen && (
        <EditThreadModal 
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            threadData={thread} 
        />
      )}

      {/* 👇 Modal Xác nhận Xóa */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        title="Xóa bài viết?"
        message="Hành động này sẽ xóa bài viết vĩnh viễn và không thể khôi phục. Bạn có chắc chắn không?"
        isDanger={true}
        
        onConfirm={() => deleteMutation.mutate(thread.thread_id)}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}