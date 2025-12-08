"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { 
  XMarkIcon, 
  PencilSquareIcon, 
  ArrowUpTrayIcon,
  TrashIcon,
  PhotoIcon
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import apiThead from "@/lib/API/thead";
import type { IThread, IThreadMedia } from "@/types/thread";
import ConfirmModal from "@/utils/ConfirmModal"; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
  threadData: IThread;
}

interface EditFormInputs {
  title: string;
  content: string;
  tags_input: string;
}

const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "";

export default function EditThreadModal({ isOpen, onClose, threadData }: Props) {
  const queryClient = useQueryClient();
  
  // --- STATE ---
  const [existingMedia, setExistingMedia] = useState<IThreadMedia[]>([]); 
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([]); 
  const [newFiles, setNewFiles] = useState<File[]>([]); 
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingData, setPendingData] = useState<EditFormInputs | null>(null);

  const { 
    register, 
    handleSubmit, 
    setValue, 
    reset,
    watch,
    formState: { isDirty } 
  } = useForm<EditFormInputs>();

  // --- 1. FILL DATA ---
  useEffect(() => {
    if (isOpen && threadData) {
      setValue("title", threadData.title || "");
      setValue("content", threadData.content || "");
      
      const tagsString = threadData.tags 
        ? (threadData.tags.map((t: any) => typeof t === 'string' ? t : t.name).join(", ")) 
        : "";
      setValue("tags_input", tagsString);

      setExistingMedia(threadData.media || []);
      setDeletedMediaIds([]);
      setNewFiles([]);
    }
  }, [isOpen, threadData, setValue]);

  // --- 2. MEDIA LOGIC ---
  const removeExistingImage = (mediaId: string) => {
    // 👇 FIX TS: Chỉ dùng media_id, bỏ .id
    setExistingMedia((prev) => prev.filter((item) => item.media_id !== mediaId));
    setDeletedMediaIds((prev) => [...prev, mediaId]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setNewFiles((prev) => [...prev, ...filesArray]); 
    }
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // --- 3. API MUTATION ---
  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => apiThead.update(threadData.thread_id, formData),
    onSuccess: () => {
      toast.success("Cập nhật thành công!");
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["thread", threadData.thread_id] });
      handleCloseFull();
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.response?.data?.detail || "Lỗi cập nhật");
      setShowConfirm(false);
    },
  });

  const onPreSubmit: SubmitHandler<EditFormInputs> = (data) => {
    setPendingData(data);
    setShowConfirm(true);
  };

  // === LOGIC TẠO FORM DATA ===
  const handleConfirmSave = () => {
    if (!pendingData) return;

    const formData = new FormData();
    
    // 1. Text Fields
    formData.append("title", pendingData.title);
    formData.append("content", pendingData.content);
    if (threadData.category?.category_id) {
        formData.append("category_id", threadData.category.category_id);
    }
    
    // 2. Tags
    const tagsArray = pendingData.tags_input.split(',').map(tag => tag.trim()).filter(Boolean);
    tagsArray.forEach(tag => {
        formData.append("tags", tag);
    });

    // 3. Delete Media IDs
    if (deletedMediaIds.length > 0) {
      deletedMediaIds.forEach((id) => {
        formData.append("delete_media_ids", id);
      });
    }

    // 4. New Files
    if (newFiles.length > 0) {
      newFiles.forEach((file) => {
        formData.append("new_files", file);
      });
    }

    updateMutation.mutate(formData);
  };

  const handleCloseFull = () => {
    setShowConfirm(false);
    setPendingData(null);
    reset();
    setNewFiles([]);
    setDeletedMediaIds([]);
    onClose();
  };

  const getFullImageUrl = (url: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_DOMAIN.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  };

  const isImageChanged = newFiles.length > 0 || deletedMediaIds.length > 0;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          // 👇 FIX Tailwind: Dùng z-50 thay vì z-[100] hoặc z-[50] nếu không cần thiết quá cao
          // Hoặc dùng z-[9999] nếu muốn đè lên tất cả toast/header
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
              onClick={handleCloseFull} 
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }} 
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20">
                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                  <span className="p-1.5 bg-blue-50 rounded-lg"><PencilSquareIcon className="w-5 h-5 text-blue-600"/></span>
                  Chỉnh sửa bài viết
                </h3>
                <button onClick={handleCloseFull} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                  <XMarkIcon className="w-6 h-6"/>
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/30 flex-1">
                <form id="edit-form" onSubmit={handleSubmit(onPreSubmit)} className="space-y-6">
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Tiêu đề <span className="text-red-500">*</span></label>
                        <input {...register("title", { required: true })} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none font-medium" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Nội dung <span className="text-red-500">*</span></label>
                        <textarea {...register("content", { required: true })} rows={6} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 outline-none resize-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Tags</label>
                        <input {...register("tags_input")} placeholder="VD: Review, Hỏi đáp..." className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none" />
                    </div>
                  </div>

                  {/* Media Section */}
                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <label className="text-sm font-bold text-gray-700 flex justify-between items-center">
                      Hình ảnh / Video
                      <span className="text-xs text-gray-500">{existingMedia.length} cũ • {newFiles.length} mới</span>
                    </label>

                    <div className="grid grid-cols-4 gap-3">
                      {/* Old Media */}
                      {existingMedia.map((media) => (
                        // 👇 FIX TS: Xóa "|| media.id"
                        <div key={media.media_id} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
                          <Image src={getFullImageUrl(media.file_url)} fill alt="old" className="object-cover" />
                          <button 
                            type="button" 
                            // 👇 FIX TS: Xóa "|| media.id"
                            onClick={() => removeExistingImage(media.media_id)} 
                            className="absolute top-1 right-1 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      {/* New Media */}
                      {newFiles.map((file, index) => (
                        <div key={`new-${index}`} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-blue-500">
                          <Image src={URL.createObjectURL(file)} fill alt="new" className="object-cover" />
                          <button type="button" onClick={() => removeNewFile(index)} className="absolute top-1 right-1 bg-gray-900/60 text-white p-1 rounded-full">
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-0 w-full bg-blue-600 text-white text-[10px] text-center font-bold">Mới</div>
                        </div>
                      ))}

                      {/* Add Button */}
                      <div onClick={() => fileInputRef.current?.click()} className="relative aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 cursor-pointer flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 gap-1">
                        <ArrowUpTrayIcon className="w-6 h-6" />
                        <span className="text-xs font-semibold">Thêm</span>
                        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
                      </div>
                    </div>
                    
                    {deletedMediaIds.length > 0 && (
                      <p className="text-xs text-red-500 italic flex items-center gap-1">
                        <TrashIcon className="w-3 h-3"/> Sẽ xóa {deletedMediaIds.length} ảnh cũ khi lưu.
                      </p>
                    )}
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3 sticky bottom-0 z-20">
                <button type="button" onClick={handleCloseFull} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl text-sm">Hủy bỏ</button>
                <button type="submit" form="edit-form" disabled={(!isDirty && !isImageChanged) || updateMutation.isPending} className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 text-sm">
                  {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={showConfirm}
        title="Lưu thay đổi?"
        message="Nội dung sẽ được cập nhật công khai."
        isDanger={deletedMediaIds.length > 0} 
        onConfirm={handleConfirmSave}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}