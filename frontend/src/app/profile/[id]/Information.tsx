"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic"; // Lazy load optimization
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"
import clsx from "clsx";
import url_img from "@/utils/url_img"
// Types & APIs
import { UserTheadResponse } from "@/types/home";
import APIUser from "@/lib/API/user";
import { updateAvatarAPI, updateBackgroundAPI } from "@/lib/API/userProfile";
import { useAuthStore } from "@/lib/store/tokenStore";

// Components
import ReputationBadge from "@/utils/ReputationBadge";
import avatarDefault from "../../../../public/avatar-mac-dinh.jpg"; 

// Icons
import { CameraIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

// --- DYNAMIC IMPORT MODAL ---
// Chỉ tải file JS của Modal khi người dùng thực sự cần (isEditModalOpen = true)
const EditProfileModal = dynamic(() => import("../EditProfileModal"), {
  ssr: false, // Modal này không cần SSR
  loading: () => <div className="fixed inset-0 z-50 bg-black/10" />
});

export default function Information({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // --- 1. LOGIC CHECK CHÍNH CHỦ (ZUSTAND) ---
  const { user: currentUser, setUser } = useAuthStore();
  const isOwner = currentUser?.user_id === id;

  // --- 2. FETCH DATA ---
  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => APIUser.APIpublic_proflle(id),
    enabled: !!id,
  });

 

  const data = responseData?.data as UserTheadResponse | undefined;

  // --- 3. HANDLE UPLOADS ---
  const avatarMutation = useMutation({
    mutationFn: updateAvatarAPI,
    onSuccess: (res) => {
      toast.success("Cập nhật avatar thành công");
      queryClient.invalidateQueries({ queryKey: ["user-profile", id] });
      // Cập nhật ngay vào Store để header/navbar đổi theo
      if (currentUser && isOwner) setUser({ ...currentUser, url_avatar: res.url_avatar });
    },
    onError: () => toast.error("Lỗi tải ảnh đại diện")
  });

  const bgMutation = useMutation({
    mutationFn: updateBackgroundAPI,
    onSuccess: (res) => {
      toast.success("Cập nhật ảnh bìa thành công");
      queryClient.invalidateQueries({ queryKey: ["user-profile", id] });
      if (currentUser && isOwner) setUser({ ...currentUser, url_bg: res.url_background });
    },
    onError: () => toast.error("Lỗi tải ảnh bìa")
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "background") => {
    const file = e.target.files?.[0];
    if (file) type === "avatar" ? avatarMutation.mutate(file) : bgMutation.mutate(file);
  };

  // --- 4. RENDER ---
  if (isLoading) {
    return (
      <div className="bg-white rounded-b-lg overflow-hidden shadow-sm animate-pulse">
        <div className="h-[300px] bg-gray-200 w-full"></div>
        <div className="px-8 pb-4 h-40 relative">
             <div className="absolute -top-12 h-40 w-40 rounded-full bg-gray-300 border-4 border-white"></div>
        </div>
      </div>
    );
  }

  if (isError) return <div className="p-8 text-center text-red-500">Không thể tải thông tin người dùng.</div>;

  return (
    <>
      <div className="bg-white shadow-sm rounded-b-lg relative group/cover">
        
        {/* --- ẢNH BÌA --- */}
        <div className="relative h-[250px] md:h-[350px] w-full bg-gray-300 overflow-hidden rounded-b-lg">
          <Image
            src={url_img(data?.url_background) ||"https://images.unsplash.com/photo-1506744038136-46273834b3fb" }
            alt="Cover Photo"
            fill
            priority // Ưu tiên load ảnh to nhất trang
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
          
          {/* Nút sửa Background (Only Owner) */}
          {/* Nút sửa Background (Only Owner) */}
{isOwner && (
  <button 
    onClick={() => backgroundInputRef.current?.click()}
    disabled={bgMutation.isPending}
    // THÊM z-20 và cursor-pointer VÀO CLASS DƯỚI ĐÂY
    className="absolute bottom-4 right-4 z-20 bg-white/90 text-gray-800 px-3 py-2 rounded-md font-semibold shadow-sm flex items-center gap-2 hover:bg-white transition opacity-0 group-hover/cover:opacity-100 backdrop-blur-sm cursor-pointer"
  >
    {bgMutation.isPending ? (
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    ) : (
        <CameraIcon className="w-5 h-5" />
    )}
    <span className="text-sm hidden md:inline">Chỉnh sửa ảnh bìa</span>
  </button>
)}
          <input type="file" ref={backgroundInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "background")} />
        </div>

        {/* --- THÔNG TIN USER --- */}
        <div className="px-4 md:px-8 pb-4">
          <div className="flex flex-col md:flex-row items-end -mt-12 md:-mt-16 relative z-10">
            
            {/* AVATAR */}
            <div className="relative group/avatar">
              <div className="h-32 w-32 md:h-44 md:w-44 rounded-full border-[4px] border-white bg-gray-100 overflow-hidden relative shadow-lg">
                <Image 
                    src={ url_img(data?.url_avatar)|| avatarDefault} 
                    alt="Avatar" 
                    fill 
                    sizes="(max-width: 768px) 150px, 200px"
                    className="object-cover" 
                />
                
                {/* Overlay sửa Avatar (Only Owner) */}
                {isOwner && (
                  <div 
                    onClick={() => !avatarMutation.isPending && avatarInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer z-10"
                  >
                    {avatarMutation.isPending ? (
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <CameraIcon className="w-8 h-8 text-white" />
                    )}
                  </div>
                )}
              </div>
              <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "avatar")} />
            </div>

            {/* NAME & BIO */}
            <div className="flex-1 mt-3 md:mt-0 md:ml-6 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-2 mb-1 justify-center md:justify-start">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{data?.firstName} {data?.lastName}</h1>
                <ReputationBadge score={data?.reputation_score || 0} size="md" showScore />
              </div>

              <p className="text-gray-600 font-medium text-sm md:text-base max-w-2xl mx-auto md:mx-0">
                {data?.description || "Người dùng này chưa viết giới thiệu."}
              </p>
            </div>

            {/* BUTTON EDIT (Only Owner) */}
            {isOwner ? (
              <div className="mt-4 md:mt-0 md:mb-4 shrink-0">
                <button 
                  onClick={() => setEditModalOpen(true)}
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold transition shadow-sm active:scale-95"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  <span>Chỉnh sửa trang cá nhân</span>
                </button>
              </div>
            ) : (
                // Khoảng trống nếu là khách (hoặc nút Add Friend sau này)
                <div className="mt-4 md:mt-0 md:mb-4 h-10 w-10"></div>
            )}
          </div>
          
          <hr className="mt-6 mb-2 border-gray-200" />

          {/* Nav Tabs */}
          <nav className="flex gap-1 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {["Bài viết", "Giới thiệu", "Bạn bè", "Ảnh"].map((item, index) => (
              <button 
                key={item} 
                className={clsx(
                    "px-4 py-3 font-semibold text-sm rounded-md transition whitespace-nowrap",
                    index === 0 ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* RENDER MODAL DYNAMICALLY */}
      {isEditModalOpen && (
       <EditProfileModal 
    isOpen={isEditModalOpen} 
    onClose={() => setEditModalOpen(false)} 
    // Truyền đủ data
    userData={{
        firstName: data?.firstName || "",
        lastName: data?.lastName || "",
        description: data?.description || ""
    }}
    userId={id} 
/>
      )}
    </>
  );
}