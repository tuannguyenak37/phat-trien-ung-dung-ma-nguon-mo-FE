"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ClockIcon,
  HeartIcon as HeartOutline,
  ChatBubbleLeftIcon,
  ShareIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import type { Thread, Media } from "@/types/home";
import UserThead from "./userthead";
import { motion, AnimatePresence } from "framer-motion";

const API_DOMAIN = "http://localhost:8000/";

// --- HÀM XỬ LÝ THỜI GIAN ---
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

// --- 1. COMPONENT LIGHTBOX ---
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

  const getImageUrl = (url: string) =>
    url.startsWith("http") ? url : `${API_DOMAIN}${url}`;

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
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* --- NÚT ĐÓNG (ĐÃ SỬA TO & RÕ) --- */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        // z-[10000] để nổi lên trên cùng
        // p-3: vùng bấm rộng
        // bg-black/50: nền đen mờ để nổi trên ảnh trắng
        // text-white: icon màu trắng
        className="absolute top-19 right-6 z-[10000] p-3 bg-black/50 hover:bg-red-600 rounded-full text-white border border-white/20 transition-all shadow-lg hover:scale-110 group"
        title="Đóng"
      >
        <XMarkIcon className="w-8 h-8 sm:w-10 sm:h-10 font-bold stroke-2" />
      </button>

      {/* Container Ảnh */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút Prev */}
        {images.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-4 z-50 p-4 bg-black/50 rounded-full hover:bg-white/20 text-white transition-all hover:scale-110 border border-white/10"
          >
            <ChevronLeftIcon className="w-8 h-8" />
          </button>
        )}

        {/* Ảnh Chính */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="relative flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageUrl(images[currentIndex].file_url)}
            alt="Full preview"
            className="max-w-[95vw] max-h-[85vh] object-contain shadow-2xl shadow-black rounded-md"
          />
        </motion.div>

        {/* Nút Next */}
        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-4 z-50 p-4 bg-black/50 rounded-full hover:bg-white/20 text-white transition-all hover:scale-110 border border-white/10"
          >
            <ChevronRightIcon className="w-8 h-8" />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none">
        {images.length > 1 && images.length < 10 && (
            <div className="flex gap-2 pointer-events-auto bg-black/40 p-2 rounded-2xl backdrop-blur-sm border border-white/10">
                {images.map((img, idx) => (
                <button
                    key={img.media_id || idx}
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                    }}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentIndex
                        ? "border-red-500 scale-110 shadow-lg"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                    src={getImageUrl(img.file_url)}
                    className="w-full h-full object-cover"
                    alt="thumb"
                    />
                </button>
                ))}
            </div>
        )}
        
        <span className="text-white font-bold font-mono text-lg tracking-widest drop-shadow-md">
          {currentIndex + 1} / {images.length}
        </span>
      </div>
    </motion.div>
  );
};

// --- 2. COMPONENT THREAD CARD ---
export default function ThreadCard({ thread }: { thread: Thread }) {
  const [isLiked, setIsLiked] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const getImageUrl = (url: string) =>
    url.startsWith("http") ? url : `${API_DOMAIN}${url}`;
  
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
      <div className="group mb-6 rounded-2xl border border-white/5 bg-[#0a0a0a] p-5 transition-all hover:border-red-900/30 hover:shadow-[0_0_30px_rgba(153,27,27,0.1)]">
        
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <UserThead id={thread.user_id} />
            
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium mt-1">
                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                <ClockIcon className="w-3 h-3" />
                {thread.created_at ? formatRelativeTime(thread.created_at) : ""}
            </div>
          </div>
        </div>

        <div className="mb-4">
          {thread.title && (
            <h3 className="text-lg font-bold text-gray-100 mb-1.5 leading-tight">
              {thread.title}
            </h3>
          )}
          {thread.content && (
            <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed font-light">
              {thread.content}
            </p>
          )}
        </div>

        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {thread.tags.map((tag, idx) => {
              const tagName = typeof tag === "string" ? tag : tag.name;
              return (
                <span
                  key={idx}
                  className="text-[10px] font-bold uppercase tracking-widest text-red-400 bg-red-950/20 px-2 py-1 rounded border border-red-900/30 hover:border-red-500/50 hover:text-red-300 cursor-pointer transition-colors"
                >
                  #{tagName}
                </span>
              );
            })}
          </div>
        )}

        {count > 0 && (
          <div
            className={`mb-4 grid gap-0.5 overflow-hidden rounded-xl border border-white/5 ${getGridClass()}`}
          >
            {mediaList.slice(0, 4).map((media, index) => {
              const isThreeLayoutFirstItem = count === 3 && index === 0;
              const remaining = count - 4;

              return (
                <div
                  key={media.media_id || index}
                  onClick={() => openGallery(index)}
                  className={`relative bg-[#151515] cursor-pointer group/img overflow-hidden h-full w-full
                        ${isThreeLayoutFirstItem ? "row-span-2" : ""}
                    `}
                >
                  <Image
                    src={getImageUrl(media.file_url)}
                    alt="media"
                    fill
                    className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {index === 3 && remaining > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 hover:bg-black/70 transition-colors backdrop-blur-[1px]">
                      <span className="text-2xl font-bold text-white drop-shadow-lg">
                        +{remaining}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <div className="flex gap-2">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group/btn
                        ${isLiked ? "text-red-500 bg-red-500/10" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}
                    `}
            >
              {isLiked ? (
                <HeartSolid className="w-5 h-5 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              ) : (
                <HeartOutline className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              )}
              <span className="text-xs font-medium">{isLiked ? "24" : "23"}</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all group/cmt">
              <ChatBubbleLeftIcon className="w-5 h-5 group-hover/cmt:-translate-y-0.5 transition-transform" />
              <span className="text-xs font-medium">8</span>
            </button>
          </div>

          <button className="p-2 text-gray-600 hover:text-white transition-colors rounded-full hover:bg-white/5">
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
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