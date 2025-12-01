"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import UserAPI from "../../lib/API/user";
import Image from "next/image";
import avatarDefault from "../../../public/avatar-mac-dinh.jpg"; // Đổi tên biến tránh trùng
import Link from "next/link";
import { UserTheadResponse } from "@/types/home";

const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";

interface UserTheadProps {
  id: string;
}

export default function UserThead({ id }: UserTheadProps) {
  const { data: response, isLoading } = useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => UserAPI.APIpublic_proflle(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // Cache 5 phút để đỡ gọi lại nhiều
  });

  const user = response?.data as UserTheadResponse | undefined;

  // Hàm xử lý đường dẫn ảnh an toàn
const getAvatarUrl = (url?: string | null) => {
    if (!url) return avatarDefault;
    if (url.startsWith("http")) return url;
    return `${API_DOMAIN}/${url.replace(/^\//, "")}`;
  };

  // 1. TRẠNG THÁI LOADING (SKELETON)
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 mb-3">
        {/* Skeleton Avatar: Tròn xám */}
        <div className="w-10 h-10 rounded-full bg-zinc-800 animate-pulse border border-white/5" />
        
        {/* Skeleton Text: Thanh ngang */}
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse" />
          <div className="h-2 w-16 bg-zinc-800 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // 2. TRẠNG THÁI CÓ DỮ LIỆU
  return (
    <div className="flex items-center gap-2 mb-3 group">
      {/* Avatar có Link */}
      <Link href={`/profile/${user?.user_id}`} className="relative block">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10 transition-transform group-hover:scale-105 group-hover:border-red-500/50">
          <Image
            src={getAvatarUrl(user?.url_avatar)}
            alt="avatar"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40px"
          />
        </div>
      </Link>

      {/* Tên User có Link */}
      <div className="flex flex-col">
        <Link 
            href={`/profile/${user?.user_id}`}
            className="font-bold text-sm text-gray-200 hover:text-red-500 transition-colors uppercase tracking-wide leading-none"
        >
          {user?.firstName || "Unknown"} {user?.lastName || ""}
        </Link>
        
        {/* (Tùy chọn) Hiển thị Role nếu là Admin */}
        {/* {user?.role === 'admin' && <span className="text-[10px] text-red-500 font-bold mt-1">ADMIN</span>} */}
      </div>
    </div>
  );
}