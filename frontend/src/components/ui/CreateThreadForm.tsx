"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { 
  PhotoIcon, XMarkIcon, HashtagIcon, FireIcon 
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/tokenStore";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { categoryService } from "@/lib/API/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiThead from "@/lib/API/thead";
import { motion, AnimatePresence, Variants } from "framer-motion"; // Import Framer Motion

// --- TYPES ---
interface CategoryItem {
  category_id: string;
  name: string;
  slug: string;
}
interface ThreadFormInputs {
  title: string;
  content: string;
  category_id: string;
  tags_input: string;
  media_files: FileList;
}

// --- MOTION COMPONENT: EMBER PARTICLES ---
// Đốm lửa bay ngẫu nhiên bằng Framer Motion
const EmberParticles = () => {
  // Tạo mảng tĩnh để render, random giá trị trong lúc render
  const particleCount = 15;
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-1 h-1 bg-orange-500 rounded-full blur-[1px]"
          initial={{ 
            opacity: 0, 
            y: 0, 
            x: `${Math.random() * 100}%` 
          }}
          animate={{ 
            opacity: [0, 0.8, 0], 
            y: -300 - Math.random() * 200, // Bay lên cao ngẫu nhiên
            x: `${(Math.random() - 0.5) * 50}%` // Bay xiên ngẫu nhiên
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
          style={{
            boxShadow: "0 0 8px 2px rgba(255, 69, 0, 0.6)"
          }}
        />
      ))}
    </div>
  );
};

// --- MOTION VARIANTS (Cấu hình chuyển động) ---
const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 } // Hiệu ứng nảy nhẹ
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Các con xuất hiện cách nhau 0.1s
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export default function CreateThreadForm() {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ThreadFormInputs>();
  const mediaFiles = watch("media_files");

  // Get Categories
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await categoryService.category_theads();
        return res.data?.list_thread || [];
      } catch { return []; }
    },
  });

  // Mutation
  const createThreadMutation = useMutation({
    mutationFn: (formData: FormData) => apiThead.APICreate(formData),
    onSuccess: () => {
      toast.success("Ngọn lửa đã được thắp sáng!", { 
        icon: '🔥',
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' } 
      });
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["user-threads"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || "Lỗi khi đăng bài");
    },
  });

  // Preview Logic
  useEffect(() => {
    if (mediaFiles && mediaFiles.length > 0) {
      const newPreviews: string[] = [];
      Array.from(mediaFiles).forEach((file) => newPreviews.push(URL.createObjectURL(file)));
      setPreviewImages(newPreviews);
    } else {
      setPreviewImages([]);
    }
    return () => previewImages.forEach((src) => URL.revokeObjectURL(src));
  }, [mediaFiles]);

  // Submit
  const onSubmit: SubmitHandler<ThreadFormInputs> = (data) => {
    if (!user) return router.push("/auth/login");

    const tagsArray = data.tags_input
      ? data.tags_input.split(",").map((tag) => tag.trim()).filter((t) => t !== "")
      : [];

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("category_id", data.category_id);
    formData.append("tags", JSON.stringify(tagsArray));

    if (data.media_files?.length > 0) {
      Array.from(data.media_files).forEach((file) => formData.append("files", file));
    }
    createThreadMutation.mutate(formData);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => { reset(); setPreviewImages([]); }, 300);
  };

  return (
    <>
      {/* 1. TRIGGER BAR (THANH KÍCH HOẠT) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 relative group"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-0.5 gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
        
        <motion.div 
            onClick={openModal}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="relative bg-[#0a0a0a] rounded-2xl p-4 border border-white/10 shadow-sm cursor-pointer flex items-center gap-4 transition-colors hover:border-white/20"
        >
            {/* Avatar */}
            <div className="w-11 h-11 rounded-full bg-[#1a1a1a] border border-white/10 overflow-hidden relative shrink-0">
                {user?.url_avatar ? (
                    <Image src={user.url_avatar} fill alt="ava" className="object-cover"/>
                ) : (
                    <div className="w-full h-full bg-[#222]"></div>
                )}
            </div>

            {/* Input Fake */}
            <div className="flex-1 bg-[#151515] h-11 rounded-full flex items-center px-5 border border-white/5 group-hover:bg-[#1a1a1a] transition-colors">
                <span className="text-gray-500 font-medium text-sm">
                    Ngọn lửa vẫn đang dẫn lối... (Viết gì đó?)
                </span>
            </div>

            {/* Icon */}
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-[#151515] text-gray-400 group-hover:text-orange-500 transition-colors">
                 <PhotoIcon className="w-5 h-5" />
            </div>
        </motion.div>
      </motion.div>

      {/* 2. MODAL (POPUP FORM) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop (Fade In) */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
                onClick={closeModal}
            />

            {/* Main Card (Zoom & Slide Up) */}
            <motion.div 
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(255,69,0,0.15)] relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
            >
              
              {/* --- HIỆU ỨNG LỬA CHẠY NỀN --- */}
              <EmberParticles />

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur relative z-20">
                  <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                     <FireIcon className="w-5 h-5 text-orange-600 animate-pulse" /> Tạo bài viết
                  </h3>
                  <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition">
                      <XMarkIcon className="w-5 h-5" />
                  </button>
              </div>

              {/* Body (Staggered Animation) */}
              <div className="overflow-y-auto p-5 custom-scrollbar relative z-20">
                  <motion.form 
                    id="create-thread-form" 
                    onSubmit={handleSubmit(onSubmit)} 
                    className="space-y-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                      
                      {/* User & Category */}
                      <motion.div variants={itemVariants} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#222] overflow-hidden relative border border-white/10">
                               {user?.url_avatar && <Image src={user.url_avatar} fill alt="ava" className="object-cover"/>}
                          </div>
                          <div>
                              <h4 className="font-semibold text-gray-200 text-sm">{user?.firstName} {user?.lastName}</h4>
                              <select 
                                  {...register("category_id", { required: true })}
                                  className="mt-0.5 bg-transparent text-xs text-orange-500 font-medium border-none outline-none cursor-pointer hover:text-orange-400 transition-colors p-0 uppercase tracking-wide"
                              >
                                  <option value="" className="bg-[#1a1a1a] text-gray-400">Chọn chủ đề ▼</option>
                                  {!isLoading && categories.map((c: CategoryItem) => (
                                      <option key={c.category_id} value={c.category_id} className="bg-[#1a1a1a] text-gray-300">
                                          {c.name}
                                      </option>
                                  ))}
                              </select>
                          </div>
                      </motion.div>

                      {/* Inputs */}
                      <motion.div variants={itemVariants}>
                          <input 
                              {...register("title", { required: "Nhập tiêu đề" })}
                              type="text" 
                              placeholder="Tiêu đề bài viết..." 
                              className="w-full bg-transparent text-xl font-bold text-white placeholder-gray-600 border-none outline-none focus:ring-0 p-0"
                          />
                      </motion.div>

                      <motion.div variants={itemVariants}>
                          <textarea 
                              {...register("content", { required: "Nhập nội dung" })}
                              placeholder="Chia sẻ câu chuyện của bạn..." 
                              rows={4}
                              className="w-full bg-transparent text-base text-gray-300 placeholder-gray-600 border-none outline-none focus:ring-0 p-0 resize-none min-h-[100px]"
                          ></textarea>
                      </motion.div>

                      <motion.div variants={itemVariants} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                          <HashtagIcon className="w-4 h-4 text-orange-500" />
                          <input 
                              {...register("tags_input")}
                              type="text" 
                              placeholder="Thêm tags (cách nhau dấu phẩy)..." 
                              className="flex-1 bg-transparent text-sm text-orange-300 placeholder-gray-600 border-none outline-none focus:ring-0 p-0"
                          />
                      </motion.div>

                      {/* Media */}
                      <motion.div variants={itemVariants}>
                          {previewImages.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                  {previewImages.map((src, idx) => (
                                      <motion.div 
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={idx} 
                                        className="relative aspect-video bg-[#111] rounded-lg overflow-hidden border border-white/10"
                                      >
                                          <Image src={src} fill alt="preview" className="object-cover" />
                                      </motion.div>
                                  ))}
                              </div>
                          )}
                          <motion.div 
                             whileHover={{ scale: 1.01, borderColor: "rgba(249, 115, 22, 0.4)" }}
                             whileTap={{ scale: 0.99 }}
                             className="relative group cursor-pointer border border-dashed border-white/10 rounded-xl p-4 hover:bg-white/5 transition-colors text-center"
                          >
                              <input {...register("media_files")} type="file" multiple accept="image/*,video/*" className="absolute inset-0 opacity-0 cursor-pointer z-10"/>
                              <div className="flex flex-col items-center gap-1">
                                  <PhotoIcon className="w-6 h-6 text-gray-500 group-hover:text-orange-500 transition-colors" />
                                  <span className="text-xs text-gray-500 font-medium">Thêm ảnh hoặc video</span>
                              </div>
                          </motion.div>
                      </motion.div>

                  </motion.form>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 bg-[#0a0a0a]/80 backdrop-blur relative z-20">
                  <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      form="create-thread-form"
                      type="submit" 
                      disabled={createThreadMutation.isPending}
                      className="w-full gradient-to-r from-orange-700 to-red-800 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-[0_4px_20px_rgba(255,69,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                      {createThreadMutation.isPending ? "Đang thắp lửa..." : "Đăng Bài"}
                  </motion.button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}