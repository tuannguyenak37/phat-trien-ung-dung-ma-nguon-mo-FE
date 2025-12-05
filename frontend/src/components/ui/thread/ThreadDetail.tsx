"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// 1. Import TanStack Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Icons
import {
  ShareIcon,
  EllipsisHorizontalIcon,
  ChevronLeftIcon,
  FlagIcon,
  PencilSquareIcon,
  TrashIcon,
  LinkIcon,
  XMarkIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

// Components & Types
// Lưu ý: Đường dẫn import có thể thay đổi tùy cấu trúc folder của bạn
// Components & Types

import VoteControl from "../VoteControl";

import UserThead from "../userthead";

import CommentSection from "../comment/CommentSection";

import api from "@/lib/API/thead";

import type { IThread, IThreadMedia } from "@/types/thread";


// --- HELPERS ---
const FacebookIcon = () => (<svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>);
const ZaloIcon = () => (<span className="w-5 h-5 font-bold text-blue-600 flex items-center justify-center bg-blue-50 rounded text-[10px]">Zalo</span>);

// --- MODAL IMAGE GALLERY ---
const ImageGalleryModal = ({ images, initialIndex, onClose }: { images: IThreadMedia[]; initialIndex: number; onClose: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";
    const getImageUrl = (url: string) => url.startsWith("http") ? url : `${API_DOMAIN.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev + 1) % images.length);
            if (e.key === "ArrowLeft") setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose, images.length]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center" onClick={onClose}>
            <button onClick={onClose} className="absolute top-5 right-5 text-white p-2 bg-white/10 rounded-full hover:bg-white/20"><XMarkIcon className="w-8 h-8"/></button>
            <div className="relative w-full h-full flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
                {images.length > 1 && <button onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)} className="absolute left-4 text-white p-3 bg-white/10 rounded-full hover:bg-white/20"><ChevronLeftIcon className="w-8 h-8"/></button>}
                
                <motion.div key={currentIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative max-w-full max-h-full">
                    {images[currentIndex].media_type === "image" ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={getImageUrl(images[currentIndex].file_url)} className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl" alt="Full Preview" />
                    ) : (
                        <video src={getImageUrl(images[currentIndex].file_url)} className="max-w-[90vw] max-h-[85vh] rounded-lg shadow-2xl" controls autoPlay />
                    )}
                </motion.div>

                {images.length > 1 && <button onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)} className="absolute right-4 text-white p-3 bg-white/10 rounded-full hover:bg-white/20"><ChevronRightIcon className="w-8 h-8"/></button>}
            </div>
        </motion.div>
    );
};

// =================================================================
// MAIN COMPONENT
// =================================================================
export default function ThreadDetail({ initialData }: { initialData: IThread }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // --- 1. TANSTACK QUERY: FETCH DATA ---
  // Sử dụng initialData từ SSR để hiển thị ngay lập tức, sau đó React Query sẽ quản lý cache
  const { data: thread } = useQuery({
    queryKey: ['thread', initialData.thread_id],
    // 👇 FIX: Hàm này phải trả về IThread, không phải AxiosResponse
    queryFn: async () => {
        const response: any = await api.public.getById(initialData.thread_id);
        // Trả về .data nếu response là Axios object, ngược lại trả về chính nó
        return response.data || response;
    },
    initialData: initialData,
    staleTime: 1000 * 60 * 5, // 5 phút mới gọi lại API
  });

  // --- 2. TANSTACK MUTATION: DELETE ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(id),
    onSuccess: () => {
        toast.success("Đã xóa bài viết thành công");
        queryClient.invalidateQueries({ queryKey: ['feed'] }); // Làm mới feed
        router.push("/"); // Quay về trang chủ
    },
    onError: (error) => {
        console.error(error);
        toast.error("Có lỗi xảy ra khi xóa bài viết");
    }
  });

  // --- AUTH LOGIC ---
  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
      const userStr = typeof window !== "undefined" ? localStorage.getItem("user_info") : null;
      if (userStr) setCurrentUser(JSON.parse(userStr));
  }, []);
  
  // Dùng optional chaining (?) an toàn
  const isOwner = currentUser?.user_id === thread?.user.user_id;

  // --- UI STATES ---
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  // Refs click outside
  const shareRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOut = (e: MouseEvent) => {
        if (shareRef.current && !shareRef.current.contains(e.target as Node)) setShowShareMenu(false);
        if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) setShowOptionsMenu(false);
    }
    document.addEventListener("mousedown", clickOut);
    return () => document.removeEventListener("mousedown", clickOut);
  }, []);

  const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";
  const getImageUrl = (url: string) => url.startsWith("http") ? url : `${API_DOMAIN.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;

  // --- ACTIONS ---
  
  const getShareUrl = () => {
      if (typeof window !== 'undefined') {
          return `${window.location.origin}/${thread.category.slug}/${thread.slug}`;
      }
      return '';
  };

  const handleDelete = () => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này vĩnh viễn?")) {
        deleteMutation.mutate(thread.thread_id);
    }
  };

  const handleEdit = () => {
      router.push(`/threads/edit/${thread.thread_id}`);
  };

  const handleCopyLink = () => {
      navigator.clipboard.writeText(getShareUrl());
      toast.success("Đã sao chép liên kết!");
      setShowShareMenu(false);
  };

  const handleShareFacebook = () => {
      const url = getShareUrl();
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
      setShowShareMenu(false);
  };

  // --- RENDER ---
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Nút Back */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors font-medium group w-fit"
      >
        <ChevronLeftIcon className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" /> 
        Quay lại
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="p-6 border-b border-gray-50 flex justify-between items-start">
            <div className="flex items-center gap-3">
                <UserThead id={thread.user.user_id} />
                <div className="text-sm">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link 
                            href={`/categories/${thread.category.slug}`} 
                            className="font-semibold text-blue-600 hover:underline bg-blue-50 px-2 py-0.5 rounded-md"
                        >
                            {thread.category.name}
                        </Link>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500" title={new Date(thread.created_at).toLocaleString()}>
                            {new Date(thread.created_at).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Menu Options (3 chấm) */}
            <div className="relative" ref={optionsRef}>
                <button onClick={() => setShowOptionsMenu(!showOptionsMenu)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                    <EllipsisHorizontalIcon className="w-6 h-6" />
                </button>
                <AnimatePresence>
                    {showOptionsMenu && (
                        <motion.div 
                            initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}}
                            className="absolute right-0 mt-2 w-48 bg-white shadow-xl border border-gray-100 rounded-xl z-20 overflow-hidden"
                        >
                            {isOwner ? (
                                <>
                                    <button onClick={handleEdit} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors">
                                        <PencilSquareIcon className="w-4 h-4"/> Chỉnh sửa
                                    </button>
                                    <button 
                                        onClick={handleDelete} 
                                        disabled={deleteMutation.isPending}
                                        className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center gap-3 text-sm text-red-600 transition-colors disabled:opacity-50"
                                    >
                                        <TrashIcon className="w-4 h-4"/> 
                                        {deleteMutation.isPending ? "Đang xóa..." : "Xóa bài viết"}
                                    </button>
                                </>
                            ) : (
                                <button className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors">
                                    <FlagIcon className="w-4 h-4"/> Báo cáo vi phạm
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* --- CONTENT --- */}
        <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {thread.title}
            </h1>
            
            {/* Nội dung bài viết (HTML) */}
            <div 
                className="prose prose-lg max-w-none text-gray-800 mb-8 whitespace-pre-wrap break-words leading-relaxed"
                dangerouslySetInnerHTML={{ __html: thread.content }} 
            />

            {thread.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                    {thread.tags.map((tag, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors border border-gray-200">
                            #{tag.name}
                        </span>
                    ))}
                </div>
            )}

            {/* Media Gallery */}
            {thread.media?.length > 0 && (
                <div className={`grid gap-2 rounded-xl overflow-hidden mb-6 ${thread.media.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
                    {thread.media.map((media, index) => (
                        <div 
                            key={index} 
                            onClick={() => {setGalleryIndex(index); setGalleryOpen(true)}} 
                            className="relative aspect-video cursor-pointer hover:opacity-95 transition-opacity bg-gray-100 group/img overflow-hidden"
                        >
                            {media.media_type === "image" ? (
                                <Image 
                                    src={getImageUrl(media.file_url)} 
                                    fill 
                                    alt="media" 
                                    className="object-cover group-hover/img:scale-105 transition-transform duration-500" 
                                />
                            ) : (
                                <video src={getImageUrl(media.file_url)} className="w-full h-full object-cover" controls />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* --- FOOTER (VOTE & SHARE) --- */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between sticky bottom-0 z-10 md:static backdrop-blur-md md:backdrop-blur-0 bg-white/90 md:bg-gray-50">
            <VoteControl 
                threadId={thread.thread_id} 
                initialUpvotes={thread.upvote_count} 
                initialDownvotes={thread.downvote_count} 
                initialUserVote={thread.vote_stats?.is_voted || 0}
                isHorizontal={true}
            />

            {/* Nút Share */}
            <div className="relative" ref={shareRef}>
                <button 
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: thread.title,
                                text: "Xem bài viết này hay lắm!",
                                url: getShareUrl()
                            }).catch(() => setShowShareMenu(!showShareMenu));
                        } else {
                            setShowShareMenu(!showShareMenu);
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm active:scale-95 transform"
                >
                    <ShareIcon className="w-5 h-5"/> <span className="hidden sm:inline">Chia sẻ</span>
                </button>
                
                <AnimatePresence>
                    {showShareMenu && (
                        <motion.div 
                            initial={{opacity:0, scale:0.9, y: 10}} animate={{opacity:1, scale:1, y: 0}} exit={{opacity:0, scale:0.9, y: 10}}
                            className="absolute right-0 bottom-full mb-2 w-52 bg-white shadow-xl border border-gray-100 rounded-xl p-1.5 z-10 origin-bottom-right"
                        >
                            <button onClick={handleShareFacebook} className="flex w-full items-center gap-3 p-2.5 hover:bg-blue-50 rounded-lg text-sm text-gray-700 transition-colors font-medium">
                                <FacebookIcon/> Facebook
                            </button>
                            <button onClick={handleCopyLink} className="flex w-full items-center gap-3 p-2.5 hover:bg-blue-50 rounded-lg text-sm text-gray-700 transition-colors font-medium">
                                <ZaloIcon/> Zalo / Copy
                            </button>
                            <div className="border-t my-1 border-gray-100"></div>
                            <button onClick={handleCopyLink} className="flex w-full items-center gap-3 p-2.5 hover:bg-gray-50 rounded-lg text-sm text-gray-600 transition-colors font-medium">
                                <LinkIcon className="w-5 h-5"/> Sao chép link
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>

      </div>

      {/* --- PHẦN BÌNH LUẬN --- */}
      <div className="mt-8">
         <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Bình luận <span className="bg-blue-100 text-blue-700 text-sm px-2.5 py-0.5 rounded-full font-extrabold">{thread.comment_count}</span>
         </h3>
         
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[200px]">
             {/* Component quản lý bình luận */}
             <CommentSection 
                threadId={thread.thread_id} 
                commentCount={thread.comment_count} 
             />
         </div>
      </div>

      {/* Modal Ảnh Full */}
      <AnimatePresence>
        {galleryOpen && (
            <ImageGalleryModal 
                images={thread.media} 
                initialIndex={galleryIndex} 
                onClose={() => setGalleryOpen(false)} 
            />
        )}
      </AnimatePresence>
    </div>
  );
}