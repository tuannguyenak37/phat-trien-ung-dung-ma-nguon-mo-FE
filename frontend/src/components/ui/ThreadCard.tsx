"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// --- IMPORTS ---
import VoteControl from "./VoteControl"; 
import UserThead from "./userthead";
import CommentSection from "./comment/CommentSection"; // Import component Comment tổng

import {
  ClockIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

import type { Thread, Media } from "@/types/home";

const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";

// =================================================================
// 1. HÀM HELPER: FORMAT THỜI GIAN
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
  
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
};

// =================================================================
// 2. SUB-COMPONENT: LIGHTBOX (MODAL XEM ẢNH FULL)
// =================================================================
const ImageGalleryModal = ({
  images,
  initialIndex,
  onClose,
}: {
  images: Media[];
  initialIndex: number;
  onClose: () => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  const getImageUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    const baseUrl = API_DOMAIN.replace(/\/$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${path}`;
  };

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 right-6 z-[10000] p-3 bg-zinc-800/50 hover:bg-red-600 rounded-full text-white border border-white/20 transition-all shadow-lg hover:scale-110 group"
      >
        <XMarkIcon className="w-8 h-8 sm:w-10 sm:h-10 font-bold stroke-2" />
      </button>

      <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && (
          <button onClick={prevImage} className="absolute left-4 z-50 p-4 bg-zinc-800/50 rounded-full hover:bg-white/20 text-white border border-white/10 transition-transform hover:scale-110">
            <ChevronLeftIcon className="w-8 h-8" />
          </button>
        )}

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative flex items-center justify-center w-full h-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageUrl(images[currentIndex].file_url)}
            alt="Full preview"
            className="max-w-[95vw] max-h-[85vh] object-contain shadow-2xl rounded-md"
          />
        </motion.div>

        {images.length > 1 && (
          <button onClick={nextImage} className="absolute right-4 z-50 p-4 bg-zinc-800/50 rounded-full hover:bg-white/20 text-white border border-white/10 transition-transform hover:scale-110">
            <ChevronRightIcon className="w-8 h-8" />
          </button>
        )}
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none">
          <span className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-white font-mono text-sm border border-white/10">
            {currentIndex + 1} / {images.length}
          </span>
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
  
  // 👇 STATE QUẢN LÝ MỞ/ĐÓNG COMMENT
  const [showComments, setShowComments] = useState(false);

  const getImageUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    const baseUrl = API_DOMAIN.replace(/\/$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${path}`;
  };

  const mediaList = thread.media || [];
  const count = mediaList.length;

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setGalleryOpen(true);
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
      <div className="group mb-6 rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-5 transition-all hover:border-zinc-700 hover:shadow-lg">
        
        {/* --- HEADER: USER INFO --- */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <UserThead id={thread.user_id} />
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium mt-1">
              <span className="w-1 h-1 rounded-full bg-zinc-600"></span>
              <ClockIcon className="w-3 h-3" />
              {thread.created_at ? formatRelativeTime(thread.created_at) : ""}
            </div>
          </div>
          <button className="text-zinc-500 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition-colors">
            <EllipsisHorizontalIcon className="w-6 h-6" />
          </button>
        </div>

        {/* --- CONTENT --- */}
        <div className="mb-4">
          {thread.title && <h3 className="text-lg font-bold text-gray-100 mb-2 leading-tight">{thread.title}</h3>}
          {thread.content && <p className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed">{thread.content}</p>}
        </div>

        {/* --- TAGS --- */}
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {thread.tags.map((tag, idx) => (
                <span key={idx} className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-950/20 px-2 py-1 rounded border border-orange-900/30 hover:border-orange-500/50 hover:text-orange-300 cursor-pointer transition-colors">
                  #{typeof tag === "string" ? tag : tag.name}
                </span>
            ))}
          </div>
        )}

        {/* --- MEDIA GRID --- */}
        {count > 0 && (
          <div className={`mb-4 grid gap-0.5 overflow-hidden rounded-xl border border-zinc-800 ${getGridClass()}`}>
            {mediaList.slice(0, 4).map((media, index) => {
              const isThreeLayoutFirstItem = count === 3 && index === 0;
              const remaining = count - 4;
              return (
                <div key={media.media_id || index} onClick={() => openGallery(index)} className={`relative bg-[#151515] cursor-pointer group/img overflow-hidden h-full w-full ${isThreeLayoutFirstItem ? "row-span-2" : ""}`}>
                  <Image src={getImageUrl(media.file_url)} alt="media" fill className="object-cover transition-transform duration-700 group-hover/img:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                  {index === 3 && remaining > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 hover:bg-black/70 transition-colors backdrop-blur-[1px]">
                      <span className="text-2xl font-bold text-white drop-shadow-lg">+{remaining}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* --- FOOTER ACTIONS --- */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-3 mt-2">
          <div className="flex gap-4 items-center">
            
            {/* 1. VOTE CONTROL */}
            <VoteControl
              threadId={thread.thread_id}
              initialUpvotes={thread.upvote_count || 0}
              initialDownvotes={thread.downvote_count || 0}
              initialUserVote={thread.vote_stats?.is_voted || 0}
              isHorizontal={true}
            />

            {/* 2. COMMENT TOGGLE BUTTON */}
            <button 
                onClick={() => setShowComments(!showComments)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all group/cmt ${
                    showComments ? "text-blue-400 bg-blue-500/10" : "text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10"
                }`}
            >
              <ChatBubbleLeftIcon className="w-5 h-5 group-hover/cmt:-translate-y-0.5 transition-transform" />
              <span className="text-xs font-medium">
                {thread.comment_count > 0 ? `${thread.comment_count} Bình luận` : "Bình luận"}
              </span>
            </button>
          </div>

          <button className="p-2 text-zinc-600 hover:text-white transition-colors rounded-full hover:bg-white/5">
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>

        {/* --- COMMENT SECTION (Lazy Load & Animation) --- */}
        <AnimatePresence>
            {showComments && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className="mt-4 pt-4 border-t border-zinc-800/50">
                        {/* Component này sẽ tự gọi API getComments khi được render */}
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