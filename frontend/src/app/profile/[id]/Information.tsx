"use client"; 

import React from 'react';
import APIUser from "@/lib/API/user";
import { useQuery } from '@tanstack/react-query';
import { UserTheadResponse } from '@/types/home';
import Image from 'next/image';
import avatarDefault from "../../../../public/avatar-mac-dinh.jpg"; 
import { UserPlusIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline'; 

// Nhận ID từ props thay vì dùng useParams
export default function Information({ id }: { id: string }) {
  
  // 1. Fetch data bằng React Query
  const { data: responseData, isLoading, isError } = useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => APIUser.APIpublic_proflle(id),
    enabled: !!id, // Chỉ chạy khi có id
  });

  const data = responseData?.data as UserTheadResponse | undefined;

  // 2. Loading State (Skeleton)
  if (isLoading) {
    return (
      <div className="animate-pulse bg-white rounded-b-lg overflow-hidden shadow-sm">
        <div className="h-[300px] bg-gray-300 w-full"></div>
        <div className="px-8 pb-4">
          <div className="flex flex-col md:flex-row items-end -mt-12 relative z-10">
            <div className="h-40 w-40 rounded-full border-4 border-white bg-gray-300"></div>
            <div className="flex-1 mt-4 md:ml-6 space-y-3">
              <div className="h-8 bg-gray-300 w-1/3 rounded"></div>
              <div className="h-4 bg-gray-300 w-1/4 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Error State
  if (isError) {
    return <div className="text-center p-10 text-red-500 bg-white shadow-sm">Không thể tải thông tin người dùng.</div>;
  }

  // 4. Render Chính
  return (
    <div className="bg-white shadow-sm rounded-b-lg">
      
      {/* ẢNH BÌA */}
      <div className="relative h-[300px] w-full bg-gray-300 overflow-hidden rounded-b-lg group">
        <Image
          src={data?.url_bg || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop"}
          alt="Cover Photo"
          fill
          priority
          sizes="100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* THÔNG TIN HEADER */}
      <div className="px-8 pb-4">
        <div className="flex flex-col md:flex-row items-end -mt-8 md:-mt-12 relative z-10">
          
          {/* Avatar */}
          <div className="relative">
            <div className="h-40 w-40 rounded-full border-[4] border-white overflow-hidden bg-gray-200 shadow-md">
              <Image 
                src={data?.url_avatar || avatarDefault} 
                alt="Profile Avatar" 
                width={160} 
                height={160} 
                className="object-cover h-full w-full"
              />
            </div>
          </div>

          {/* Tên & Bio */}
          <div className="flex-1 mt-4 md:mt-0 md:ml-6 mb-2 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">
              {data?.firstName} {data?.lastName}
            </h1>
            <p className="text-gray-600 font-medium mt-1">
              {data?.description || "Chưa có giới thiệu."}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mb-4 md:mb-2 mt-4 md:mt-0 justify-center md:justify-start">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition shadow-sm active:scale-95">
              <UserPlusIcon className="w-5 h-5" />
              <span>Add Friend</span>
            </button>
            <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition shadow-sm active:scale-95">
              <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
              <span>Message</span>
            </button>
          </div>
        </div>

        <hr className="mt-6 mb-2 border-gray-300" />

        {/* Navigation Tabs */}
        <nav className="flex gap-1 overflow-x-auto no-scrollbar">
          {["Posts", "About", "Friends", "Photos"].map((item, index) => (
            <button 
              key={item} 
              className={`px-4 py-3 font-semibold text-sm rounded-md transition whitespace-nowrap ${
                index === 0 
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}