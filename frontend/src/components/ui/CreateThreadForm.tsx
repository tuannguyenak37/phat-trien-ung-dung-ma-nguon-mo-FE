"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { 
  PhotoIcon, XMarkIcon, HashtagIcon, PencilSquareIcon, GlobeAltIcon
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/tokenStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Khuyên dùng Sonner cho đồng bộ trang Auth
import { categoryService } from "@/lib/API/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiThead from "@/lib/API/thead";
import { motion, AnimatePresence, Variants } from "framer-motion";
import url_bg from "@/utils/url_img"
import avatar from "@/../public/avatar-mac-dinh.jpg"
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

// --- MOTION VARIANTS ---
const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", damping: 25, stiffness: 350 } 
  },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { staggerChildren: 0.05 } 
  }
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
      toast.success("Đăng bài thành công!");
      closeModal();
      queryClient.invalidateQueries({ queryKey: ["user-threads"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || "Có lỗi xảy ra, vui lòng thử lại.");
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
    if (!user) {
      toast.error("Vui lòng đăng nhập để đăng bài!");
      return router.push("/auth/login");
    }

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
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <motion.div 
            onClick={openModal}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.99 }}
            className="group relative bg-white rounded-xl p-3 border border-gray-200 shadow-sm hover:shadow-md cursor-pointer flex items-center gap-3 transition-all duration-200"
        >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-100 overflow-hidden relative shrink-0">
                {user?.url_avatar ? (
                    <Image src={url_bg(user?.url_avatar) ||avatar} fill alt="ava" className="object-cover"/>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        <span className="text-xs font-bold">You</span>
                    </div>
                )}
            </div>

            {/* Input Fake */}
            <div className="flex-1 bg-gray-100/50 h-10 rounded-full flex items-center px-4 border border-transparent group-hover:bg-gray-100 group-hover:border-gray-200 transition-all">
                <span className="text-gray-500 font-medium text-sm truncate">
                    {user?.firstName ? `${user.firstName} ơi, bạn đang nghĩ gì thế?` : "Bạn đang nghĩ gì thế?"}
                </span>
            </div>

            {/* Icons Action */}
            <div className="hidden sm:flex items-center gap-2 pr-2">
                 <div className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-primary transition-colors">
                     <PhotoIcon className="w-5 h-5" />
                 </div>
            </div>
        </motion.div>
      </motion.div>

      {/* 2. MODAL POPUP */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                onClick={closeModal}
            />

            {/* Main Modal */}
            <motion.div 
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[90vh]"
            >
              
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-20">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                     <PencilSquareIcon className="w-5 h-5 text-primary" /> Tạo bài viết mới
                  </h3>
                  <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                      <XMarkIcon className="w-5 h-5" />
                  </button>
              </div>

              {/* Form Body */}
              <div className="overflow-y-auto px-6 py-4 custom-scrollbar">
                  <form id="create-thread-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      
                      {/* User & Category Selector */}
                      <motion.div variants={contentVariants} className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-gray-100 overflow-hidden relative border border-gray-100 shadow-sm">
                               {user?.url_avatar && <Image src={user.url_avatar} fill alt="ava" className="object-cover"/>}
                          </div>
                          <div className="flex flex-col">
                              <span className="font-bold text-gray-900 text-sm leading-tight">{user?.firstName} {user?.lastName}</span>
                              
                              {/* Category Dropdown styled as a badge */}
                              <div className="relative mt-1 inline-block">
                                <GlobeAltIcon className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <select 
                                    {...register("category_id", { required: true })}
                                    className="appearance-none bg-gray-100 text-xs font-medium text-gray-600 rounded-md py-1 pl-6 pr-6 border-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-gray-200 transition-colors"
                                >
                                    <option value="">Chọn chủ đề</option>
                                    {!isLoading && categories.map((c: CategoryItem) => (
                                        <option key={c.category_id} value={c.category_id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                              </div>
                          </div>
                      </motion.div>

                      {/* Title Input */}
                      <motion.div variants={contentVariants}>
                          <input 
                              {...register("title", { required: "Vui lòng nhập tiêu đề" })}
                              type="text" 
                              placeholder="Tiêu đề bài viết..." 
                              className="w-full bg-transparent text-xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none focus:ring-0 p-0"
                          />
                      </motion.div>

                      {/* Content Textarea */}
                      <motion.div variants={contentVariants}>
                          <textarea 
                              {...register("content", { required: "Vui lòng nhập nội dung" })}
                              placeholder="Hãy chia sẻ câu chuyện của bạn..." 
                              rows={5}
                              className="w-full bg-transparent text-base text-gray-700 placeholder-gray-400 border-none outline-none focus:ring-0 p-0 resize-none min-h-[120px]"
                          ></textarea>
                      </motion.div>

                      {/* Tags Input */}
                      <motion.div variants={contentVariants} className="flex items-center gap-2">
                          <HashtagIcon className="w-4 h-4 text-primary" />
                          <input 
                              {...register("tags_input")}
                              type="text" 
                              placeholder="Thêm thẻ (VD: review, công nghệ)..." 
                              className="flex-1 bg-transparent text-sm text-primary placeholder-gray-400 border-none outline-none focus:ring-0 p-0"
                          />
                      </motion.div>

                      {/* Image Preview & Upload */}
                      <motion.div variants={contentVariants} className="pt-2">
                          {previewImages.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                  {previewImages.map((src, idx) => (
                                      <div key={idx} className="relative aspect-video bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shadow-sm group">
                                          <Image src={src} fill alt="preview" className="object-cover" />
                                      </div>
                                  ))}
                              </div>
                          )}
                          
                          <div className="relative group cursor-pointer border border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 hover:border-primary/50 transition-all text-center">
                              <input {...register("media_files")} type="file" multiple accept="image/*,video/*" className="absolute inset-0 opacity-0 cursor-pointer z-10"/>
                              <div className="flex flex-col items-center gap-2">
                                  <div className="p-2 bg-gray-100 rounded-full group-hover:bg-white group-hover:shadow-sm transition-all">
                                      <PhotoIcon className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                                  </div>
                                  <span className="text-xs text-gray-500 font-medium">Thêm ảnh hoặc video vào bài viết</span>
                              </div>
                          </div>
                      </motion.div>
                  </form>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-100 bg-white sticky bottom-0 z-20">
                  <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      form="create-thread-form"
                      type="submit" 
                      disabled={createThreadMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-black font-bold py-3 rounded-xl shadow-lg shadow-primary/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                      {createThreadMutation.isPending ? (
                        <>
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           <span>Đang đăng...</span>
                        </>
                      ) : (
                        "Đăng bài viết"
                      )}
                  </motion.button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}