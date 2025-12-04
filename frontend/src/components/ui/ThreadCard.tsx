"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner"; // Sử dụng Sonner cho đồng bộ

// --- IMPORTS ---
import VoteControl from "./VoteControl"; 
import UserThead from "./userthead";
import CommentSection from "./comment/CommentSection";

import {
  ClockIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  LinkIcon,
  FlagIcon
} from "@heroicons/react/24/outline";

// Icon Facebook/Zalo SVG (Custom components)
const FacebookIcon = () => (
  <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const ZaloIcon = () => (
  <span className="w-5 h-5 font-bold text-blue-600 flex items-center justify-center bg-blue-50 rounded text-[10px]">Zalo</span>
);

import type { Thread, Media } from "@/types/home";

const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";

// =================================================================
// 1. HELPER: FORMAT TIME
// =================================================================
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Vừa xong";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays <= 7) return `${diffInDays} ngày trước`;
  
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

// =================================================================
// 2. SUB-COMPONENT: LIGHTBOX (Gallery)
// =================================================================
// Giữ giao diện tối cho Lightbox để tập trung vào ảnh
const ImageGalleryModal = ({ images, initialIndex, onClose }: { images: Media[]; initialIndex: number; onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  const getImageUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    const baseUrl = API_DOMAIN.replace(/\/$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${path}`;
  };

  const nextImage = useCallback(() => setCurrentIndex((prev) => (prev + 1) % images.length), [images.length]);
  const prevImage = useCallback(() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, nextImage, prevImage]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 z-[10000] p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
        <XMarkIcon className="w-8 h-8" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && (
          <button onClick={prevImage} className="absolute left-4 z-50 p-3 bg-white/10 rounded-full hover:bg-white/20 text-white transition-all"><ChevronLeftIcon className="w-6 h-6" /></button>
        )}
        <motion.div key={currentIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative flex items-center justify-center w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={getImageUrl(images[currentIndex].file_url)} alt="Full preview" className="max-w-[95vw] max-h-[85vh] object-contain shadow-2xl rounded-lg" />
        </motion.div>
        {images.length > 1 && (
          <button onClick={nextImage} className="absolute right-4 z-50 p-3 bg-white/10 rounded-full hover:bg-white/20 text-white transition-all"><ChevronRightIcon className="w-6 h-6" /></button>
        )}
      </div>
    </motion.div>
  );
};

// =================================================================
// 3. MAIN COMPONENT: THREAD CARD
// =================================================================
export default function ThreadCard({ thread }: { thread: Thread }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Ref để click outside đóng menu share
  const shareMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getImageUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    const baseUrl = API_DOMAIN.replace(/\/$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${path}`;
  };

  const mediaList = thread.media || [];
  const count = mediaList.length;

  // --- SHARE FUNCTIONALITY ---
  const getCurrentUrl = () => {
    // Nếu có trang chi tiết thread, hãy thay thế logic này
    // Ví dụ: return `${window.location.origin}/thread/${thread.thread_id}`;
    return typeof window !== 'undefined' ? window.location.href : ''; 
  };

  const handleShareFacebook = () => {
    const url = getCurrentUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setShowShareMenu(false);
  };

  const handleCopyLink = () => {
    const url = getCurrentUrl();
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Đã sao chép liên kết!");
    }).catch(() => toast.error("Không thể sao chép"));
    setShowShareMenu(false);
  };
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: thread.title || 'Bài viết hay',
          text: thread.content?.substring(0, 100) + '...',
          url: getCurrentUrl(),
        });
        setShowShareMenu(false);
      } catch (err) {
        console.log('User cancelled share');
      }
    } else {
      // Fallback nếu không hỗ trợ native share thì mở menu copy
      setShowShareMenu(!showShareMenu);
    }
  };

  const getGridClass = () => {
    if (count === 1) return "grid-cols-1 aspect-video";
    if (count === 2) return "grid-cols-2 aspect-video";
    if (count === 3) return "grid-cols-2 aspect-[4/3]";
    if (count >= 4) return "grid-cols-2 aspect-square";
    return "";
  };

  return (
    <>
      {/* CARD CONTAINER: Light Theme */}
      <div className="group mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        
        {/* --- HEADER --- */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* User Component cần trả về text màu tối */}
            <UserThead id={thread.user_id} /> 
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-0.5">
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>{thread.created_at ? formatRelativeTime(thread.created_at) : ""}</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <EllipsisHorizontalIcon className="w-6 h-6" />
          </button>
        </div>

        {/* --- CONTENT --- */}
        <div className="mb-3">
          {thread.title && <h3 className="text-lg font-bold text-gray-900 mb-1.5 leading-snug">{thread.title}</h3>}
          {thread.content && <p className="text-[15px] text-gray-700 whitespace-pre-line leading-relaxed">{thread.content}</p>}
        </div>

        {/* --- TAGS --- */}
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {thread.tags.map((tag, idx) => (
                <span key={idx} className="text-[11px] font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors">
                  #{typeof tag === "string" ? tag : tag.name}
                </span>
            ))}
          </div>
        )}

        {/* --- MEDIA GRID --- */}
        {count > 0 && (
          <div className={`mb-4 grid gap-1 overflow-hidden rounded-xl ${getGridClass()}`}>
            {mediaList.slice(0, 4).map((media, index) => {
              const isThreeLayoutFirstItem = count === 3 && index === 0;
              const remaining = count - 4;
              return (
                <div key={media.media_id || index} onClick={() => { setGalleryIndex(index); setGalleryOpen(true); }} className={`relative bg-gray-100 cursor-pointer group/img overflow-hidden h-full w-full ${isThreeLayoutFirstItem ? "row-span-2" : ""}`}>
                  <Image src={getImageUrl(media.file_url)} alt="media" fill className="object-cover transition-transform duration-700 group-hover/img:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
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

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-100">
          <div className="flex gap-1 items-center">
            
            {/* 1. VOTE CONTROL (Cần style lại component này cho hợp nền sáng) */}
            <div className="mr-3">
                <VoteControl
                  threadId={thread.thread_id}
                  initialUpvotes={thread.upvote_count || 0}
                  initialDownvotes={thread.downvote_count || 0}
                  initialUserVote={thread.vote_stats?.is_voted || 0}
                  isHorizontal={true}
                />
            </div>

            {/* 2. COMMENT BUTTON */}
            <button 
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all group/cmt ${
                    showComments ? "text-primary bg-primary/5 font-medium" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
            >
              <ChatBubbleLeftIcon className="w-5 h-5 group-hover/cmt:scale-110 transition-transform" />
              <span className="text-xs">
                {thread.comment_count > 0 ? `${thread.comment_count} Thảo luận` : "Thảo luận"}
              </span>
            </button>
          </div>

          {/* 3. SHARE BUTTON & MENU */}
          <div className="relative" ref={shareMenuRef}>
              <button 
                onClick={handleNativeShare} // Ưu tiên native share trên mobile
                // Trên PC hover hoặc click để mở menu custom
                onMouseEnter={() => window.innerWidth > 768 && setShowShareMenu(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
              >
                <ShareIcon className="w-5 h-5" />
                <span className="text-xs hidden sm:inline">Chia sẻ</span>
              </button>

              <AnimatePresence>
                {showShareMenu && (
                   <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-20 origin-bottom-right"
                      onMouseLeave={() => setShowShareMenu(false)}
                   >
                      <button onClick={handleShareFacebook} className="flex w-full items-center gap-3 px-3 py-2.5 hover:bg-blue-50 text-gray-700 rounded-lg text-sm transition-colors text-left">
                          <FacebookIcon /> Facebook
                      </button>
                      
                      <button onClick={handleCopyLink} className="flex w-full items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-gray-700 rounded-lg text-sm transition-colors text-left">
                          <ZaloIcon /> Zalo / Copy
                      </button>

                      <button onClick={handleCopyLink} className="flex w-full items-center gap-3 px-3 py-2.5 hover:bg-gray-50 text-gray-700 rounded-lg text-sm transition-colors text-left">
                          <LinkIcon className="w-5 h-5 text-gray-500" /> Sao chép link
                      </button>
                      
                      <div className="my-1 border-t border-gray-100"></div>
                      
                      <button className="flex w-full items-center gap-3 px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg text-xs transition-colors text-left">
                          <FlagIcon className="w-4 h-4" /> Báo cáo
                      </button>
                   </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>

        {/* --- COMMENT SECTION --- */}
        <AnimatePresence>
            {showComments && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <CommentSection 
                            threadId={thread.thread_id} 
                            commentCount={thread.comment_count}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

      </div>

      <AnimatePresence>
        {galleryOpen && (
          <ImageGalleryModal
            images={mediaList}
            initialIndex={galleryIndex}
            onClose={() => setGalleryOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}