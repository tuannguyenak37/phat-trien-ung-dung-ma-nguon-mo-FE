"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import UserAPI from "../../lib/API/user";
import Image from "next/image";
import avatarDefault from "../../../public/avatar-mac-dinh.jpg";
import Link from "next/link";
import { UserTheadResponse } from "@/types/home";
import ReputationBadge from "@/utils/ReputationBadge";
const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";

interface UserTheadProps {
  id: string;
}

export default function UserThead({ id }: UserTheadProps) {
  
  const { data: response, isLoading } = useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => UserAPI.APIpublic_proflle(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // Tăng cache lên 10 phút
  });

  const user = response?.data as UserTheadResponse | undefined;

  const getAvatarUrl = (url?: string | null) => {
    if (!url) return avatarDefault;
    if (url.startsWith("http")) return url;
    return `${API_DOMAIN}/${url.replace(/^\//, "")}`;
  };

  // 1. SKELETON LOADING (Chuyển sang màu sáng cho hợp nền trắng)
  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        {/* Avatar Skeleton */}
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        
        {/* Text Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="h-3.5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // 2. HIỂN THỊ DỮ LIỆU
  return (
    // Xóa mb-3 ở đây để component cha (ThreadCard) tự căn chỉnh sẽ linh hoạt hơn
    <div className="flex items-center gap-3 group">
      
      {/* Avatar Wrapper */}
      <Link href={`/profile/${user?.user_id}`} className="relative block shrink-0">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:border-primary/50">
          <Image
            src={getAvatarUrl(user?.url_avatar)}
            alt="avatar"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40px"
          />
        </div>
      </Link>

      {/* Info Wrapper */}
      <div className="flex flex-col justify-center">
        {/* Tên chính: Dùng màu xám đậm (900) thay vì 200 để rõ nét */}
        <Link 
            href={`/profile/${user?.user_id}`}
            className="font-bold text-[15px] text-gray-900 leading-tight hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-2"
        >
          {user?.firstName || "Người dùng"} {user?.lastName || "Ẩn danh"}
        </Link>
        
        {/* Role hoặc Username phụ (nếu có) để tạo chiều sâu */}
        <span className="text-xs text-gray-500 font-medium mt-0.5 group-hover:text-gray-600 transition-colors">
            {user?.firstName ? user.firstName.toLowerCase() : "user"} 
            <ReputationBadge score={user?.reputation_score || 0} size="sm" />
        </span>
      </div>
    </div>
  );
}