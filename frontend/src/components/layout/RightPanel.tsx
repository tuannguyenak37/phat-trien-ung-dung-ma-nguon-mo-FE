// src/components/layout/RightPanel.tsx
"use client"; // Chuyển sang Client Component để lấy dữ liệu User trực tiếp
import ReputationBadge from "@/utils/ReputationBadge";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/tokenStore"; // Giả sử bạn dùng store này
import {
  FireIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon, // Icon cho điểm uy tín
  UserCircleIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";

// Helper lấy ảnh avatar (giống các phần trước)
const getAvatarUrl = (url?: string | null) => {
  const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";
  if (!url) return null; // Trả về null để hiển thị placeholder
  if (url.startsWith("http")) return url;
  return `${API_DOMAIN}/${url.replace(/^\//, "")}`;
};

// --- 1. USER WIDGET (Hiển thị thông tin cá nhân) ---
const UserWidget = () => {
  const { user } = useAuthStore();

  // Nếu chưa đăng nhập
  if (!user) {
    return (
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-center">
        <h3 className="font-bold text-gray-900 mb-2">Tham gia cộng đồng</h3>
        <p className="text-xs text-gray-500 mb-4">Đăng nhập để thảo luận, tích điểm uy tín và kết nối.</p>
        <Link 
          href="/auth/login"
          className="block w-full py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // Nếu đã đăng nhập (Hiển thị data bạn yêu cầu)
  const avatarSrc = getAvatarUrl(user.url_avatar);

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm group">
      {/* Cover giả lập (Màu gradient nhẹ) */}
      <div className="h-20 bg-gradient-to-r from-blue-50 to-primary/10"></div>

      <div className="px-5 pb-5 -mt-10 relative">
        {/* Avatar */}
        <div className="flex justify-between items-end">
          <div className="w-20 h-20 rounded-full border-4 border-white bg-white overflow-hidden shadow-sm">
             {avatarSrc ? (
               <Image src={avatarSrc} alt="avatar" width={80} height={80} className="object-cover w-full h-full" />
             ) : (
               <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                 <UserCircleIcon className="w-12 h-12" />
               </div>
             )}
          </div>
          <Link href="/settings" className="mb-2 p-2 rounded-full bg-gray-50 text-gray-500 hover:text-primary hover:bg-primary/10 transition-colors">
             <PencilSquareIcon className="w-5 h-5" />
          </Link>
        </div>

        {/* Info */}
        <div className="mt-3">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-xs text-gray-500 font-medium">@{user.firstName?.toLowerCase() || "user"}</p>
        </div>

        {/* Stats: Reputation Score */}
        <div className="mt-4 flex items-center gap-4 py-3 border-y border-gray-100">
           <div className="flex items-center gap-2 text-yellow-600">
              <TrophyIcon className="w-5 h-5" />
              <div className="flex flex-col">
                 <span className="text-sm font-bold leading-none">{user.reputation_score || 0}</span>
                 <span className="text-[10px] font-medium text-gray-500 uppercase">Danh tiếng</span>
              </div>
           </div>
           
           <div className="w-[1px] h-8 bg-gray-100"></div>

           <div className="flex flex-col">
               <span className="text-[10px] font-medium text-gray-500 uppercase"> <ReputationBadge score={user.reputation_score || 0} size="md" showScore={true} /></span>
           </div>
        </div>

        {/* Description / Bio */}
        <div className="mt-4">
           {user.description ? (
             <p className="text-sm text-gray-600 line-clamp-3">{user.description}</p>
           ) : (
             <div className="text-center py-2 bg-gray-50 rounded-xl border border-dashed border-gray-200">
               <p className="text-xs text-gray-400 italic">Chưa có giới thiệu bản thân</p>
               <Link href="/settings" className="text-xs text-primary font-medium hover:underline mt-1 block">
                 + Thêm mô tả
               </Link>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- 2. TRENDING WIDGET (Giao diện Light Mode) ---
const TrendingWidget = () => (
  <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm sticky top-24">
    {/* Header */}
    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
      <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
        <FireIcon className="w-5 h-5 text-red-500" />
        Chủ đề nổi bật
      </h3>
    </div>

    {/* List */}
    <ul className="divide-y divide-gray-50">
      {[
        {
          title: "Đánh giá chi tiết NextJS 14 App Router",
          replies: 342,
          tag: "Tech",
          color: "bg-blue-50 text-blue-600 border-blue-100",
        },
        {
          title: "Làm sao để tối ưu SEO cho React?",
          replies: 128,
          tag: "Hỏi đáp",
          color: "bg-green-50 text-green-600 border-green-100",
        },
        { 
          title: "Góc khoe góc làm việc tháng 5", 
          replies: 89, 
          tag: "Showcase",
          color: "bg-purple-50 text-purple-600 border-purple-100",
        },
      ].map((item, i) => (
        <li key={i}>
          <Link
            href="#"
            className="block px-5 py-3 hover:bg-gray-50 transition-colors group"
          >
            <h4 className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {item.title}
            </h4>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
              <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${item.color}`}>
                {item.tag}
              </span>
              <span className="flex items-center gap-1">
                <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" /> {item.replies}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>

    {/* Footer Widget */}
    <div className="p-3 bg-gray-50 border-t border-gray-100">
      <button className="w-full py-2 text-xs font-bold text-gray-600 hover:text-primary hover:bg-white rounded-lg transition-all flex items-center justify-center gap-2 border border-transparent hover:border-gray-200 hover:shadow-sm">
        Xem tất cả <ArrowTrendingUpIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

// --- 3. MAIN COMPONENT ---
const RightPanel = () => {
  return (
    <aside className="w-full space-y-6">
      {/* Widget thông tin User */}
      <UserWidget />

      {/* Trending Topics */}
      <TrendingWidget />

      {/* Footer Links */}
      <div className="px-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] text-gray-400 font-medium">
        <Link href="#" className="hover:text-gray-600 transition-colors">Điều khoản</Link>
        <Link href="#" className="hover:text-gray-600 transition-colors">Quyền riêng tư</Link>
        <Link href="#" className="hover:text-gray-600 transition-colors">Hỗ trợ</Link>
        <span>© 2025 Messmer Community</span>
      </div>
    </aside>
  );
};

export default RightPanel;