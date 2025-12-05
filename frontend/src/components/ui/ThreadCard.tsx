"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // 1. Import Router
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

// --- IMPORTS ---
import VoteControl from "./VoteControl"; 
import UserThead from "./userthead";
// import CommentSection from "./comment/CommentSection"; // 2. Tạm bỏ hoặc comment lại vì ta sẽ chuyển trang

import {
  ChatBubbleLeftIcon,
  ShareIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  LinkIcon,
  FlagIcon,
  PencilSquareIcon, // Icon Sửa
  TrashIcon         // Icon Xóa
} from "@heroicons/react/24/outline";

// Giả sử bạn có hook useAuth. Nếu dùng Context thì thay thế tương ứng.
// import { useAuth } from "@/hooks/useAuth"; 
// Tạm thời mock hàm này, bạn hãy thay bằng hook thật của bạn
const useAuth = () => {
    // Ví dụ lấy từ localStorage hoặc Redux/Zustand
    if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user_info"); // Hoặc nơi bạn lưu user
        return { user: userStr ? JSON.parse(userStr) : null };
    }
    return { user: null };
};

import api from "@/lib/API/thead"; 
import type { IThread, IThreadMedia } from "@/types/thread"; // Sử dụng đúng Type mới

const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";

// ... (Giữ nguyên các hàm helper formatRelativeTime, ImageGalleryModal, Icon Facebook/Zalo) ...
// Để code gọn, tôi sẽ ẩn phần Helper cũ đi, bạn giữ nguyên chúng nhé.
// =================================================================
// 1. HELPER: FORMAT TIME & ICONS (GIỮ NGUYÊN)
// =================================================================
const FacebookIcon = () => (<svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);
const ZaloIcon = () => (<span className="w-5 h-5 font-bold text-blue-600 flex items-center justify-center bg-blue-50 rounded text-[10px]">Zalo</span>);

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

const ImageGalleryModal = ({ images, initialIndex, onClose }: { images: IThreadMedia[]; initialIndex: number; onClose: () => void }) => {
    // ... (Code modal giữ nguyên) ...
    // Bạn copy lại code ImageGalleryModal từ file cũ vào đây
    // CHỈ CẦN LƯU Ý: images có kiểu IThreadMedia[]
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const getImageUrl = (url: string) => url.startsWith("http") ? url : `${API_DOMAIN.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
    const nextImage = useCallback(() => setCurrentIndex((prev) => (prev + 1) % images.length), [images.length]);
    const prevImage = useCallback(() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length), [images.length]);
    // ... (Phần UI Modal giữ nguyên) ...
    return (
        <div onClick={onClose} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90">
             {/* Rút gọn code mẫu để tập trung vào logic chính */}
             <img src={getImageUrl(images[currentIndex].file_url)} className="max-h-[90vh]" />
        </div>
    )
};


// =================================================================
// 3. MAIN COMPONENT: THREAD CARD
// =================================================================
export default function ThreadCard({ thread }: { thread: IThread }) {
  const router = useRouter();
  const { user } = useAuth(); // Lấy user hiện tại

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false); // Menu 3 chấm (Edit/Delete)

  // Ref click outside
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) setShowShareMenu(false);
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) setShowOptionsMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC QUYỀN SỞ HỮU ---
  // So sánh ID user login với ID người tạo bài viết
  const isOwner = user?.user_id === thread.user.user_id;

  // --- URL GENERATION ---
  // Tạo URL chi tiết chuẩn SEO: /category-slug/thread-slug
  const detailPath = `/Thread/${thread.category.slug}/${thread.slug}`;
  
  const getFullShareUrl = () => {
    if (typeof window !== 'undefined') {
       return `${window.location.origin}${detailPath}`;
    }
    return '';
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith("http")) return url;
    const baseUrl = API_DOMAIN.replace(/\/$/, "");
    const path = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${path}`;
  };

  const mediaList = thread.media || [];
  const count = mediaList.length;

  // --- HANDLERS ---

  // 1. Chuyển hướng sang trang chi tiết
  const handleNavigateDetail = () => {
    router.push(detailPath);
  };

  // 2. Xử lý Share
  const handleCopyLink = () => {
    const url = getFullShareUrl();
    navigator.clipboard.writeText(url).then(() => toast.success("Đã sao chép liên kết!")).catch(() => toast.error("Lỗi sao chép"));
    setShowShareMenu(false);
  };

  const handleShareFacebook = () => {
    const url = getFullShareUrl();
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    setShowShareMenu(false);
  };

  // 3. Xử lý Edit/Delete
  const handleEdit = () => {
    // Chuyển hướng sang trang edit hoặc mở modal
    // Ví dụ: /threads/edit/thread_id
    router.push(`/threads/edit/${thread.thread_id}`);
    setShowOptionsMenu(false);
  };

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
        try {
            await api.delete(thread.thread_id);
            toast.success("Xóa bài viết thành công");
            // Reload trang hoặc reload list
            window.location.reload(); 
        } catch (error) {
            toast.error("Xóa thất bại");
        }
    }
    setShowOptionsMenu(false);
  };

  // --- GRID LAYOUT LOGIC (Giữ nguyên) ---
  const getGridClass = () => {
    if (count === 1) return "grid-cols-1 aspect-video";
    if (count === 2) return "grid-cols-2 aspect-video";
    if (count === 3) return "grid-cols-2 aspect-[4/3]";
    if (count >= 4) return "grid-cols-2 aspect-square";
    return "";
  };

  return (
    <>
      <div className="group mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        
        {/* --- HEADER --- */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleNavigateDetail}>
            <UserThead id={thread.user.user_id} /> 
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-0.5">
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              {/* Link tới Category */}
              <Link href={`/Thread/categories/${thread.category.slug}`} className="hover:underline text-blue-600 font-semibold" onClick={(e)=>e.stopPropagation()}>
                 {thread.category.name}
              </Link>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>{thread.created_at ? formatRelativeTime(thread.created_at) : ""}</span>
            </div>
          </div>

          {/* MENU 3 CHẤM (OPTIONS) */}
          <div className="relative" ref={optionsMenuRef}>
            <button 
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <EllipsisHorizontalIcon className="w-6 h-6" />
            </button>

            {/* Dropdown Menu Edit/Delete */}
            <AnimatePresence>
                {showOptionsMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-20 origin-top-right"
                    >
                        {isOwner ? (
                            <>
                                <button onClick={handleEdit} className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50 text-gray-700 rounded-lg text-sm transition-colors text-left">
                                    <PencilSquareIcon className="w-4 h-4" /> Chỉnh sửa
                                </button>
                                <button onClick={handleDelete} className="flex w-full items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded-lg text-sm transition-colors text-left">
                                    <TrashIcon className="w-4 h-4" /> Xóa bài
                                </button>
                            </>
                        ) : (
                            <button className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50 text-gray-700 rounded-lg text-sm transition-colors text-left">
                                <FlagIcon className="w-4 h-4" /> Báo cáo
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>

        {/* --- CONTENT (Click vào title/content cũng nhảy sang chi tiết) --- */}
        <div className="mb-3 cursor-pointer" onClick={handleNavigateDetail}>
          {thread.title && <h3 className="text-lg font-bold text-gray-900 mb-1.5 leading-snug hover:text-blue-600 transition-colors">{thread.title}</h3>}
          {/* Cắt ngắn content nếu quá dài ở trang chủ */}
          {thread.content && (
             <div 
               className="text-[15px] text-gray-700 whitespace-pre-line leading-relaxed line-clamp-3"
               dangerouslySetInnerHTML={{ __html: thread.content }} // Nếu content là HTML
             />
          )}
        </div>

        {/* --- TAGS --- */}
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {thread.tags.map((tag, idx) => (
                <span key={idx} className="text-[11px] font-semibold text-primary bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors">
                  #{tag.name}
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
            
            {/* 1. VOTE CONTROL */}
            <div className="mr-3">
                <VoteControl
                  threadId={thread.thread_id}
                  initialUpvotes={thread.upvote_count || 0}
                  initialDownvotes={thread.downvote_count || 0}
                  initialUserVote={thread.vote_stats?.is_voted || 0}
                  isHorizontal={true}
                />
            </div>

            {/* 2. COMMENT BUTTON -> NAVIGATE TO DETAIL */}
            <button 
                onClick={handleNavigateDetail} // <--- SỬA: Chuyển hướng thay vì toggle
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-gray-500 hover:text-blue-600 hover:bg-blue-50 group/cmt"
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
                // Ưu tiên native share trên mobile, PC thì mở menu
                onClick={() => {
                    if (navigator.share) {
                        navigator.share({
                            title: thread.title,
                            text: "Xem bài viết hay này nè!",
                            url: getFullShareUrl()
                        }).catch(console.error);
                    } else {
                        setShowShareMenu(!showShareMenu);
                    }
                }}
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
                   </motion.div>
                )}
              </AnimatePresence>
          </div>
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