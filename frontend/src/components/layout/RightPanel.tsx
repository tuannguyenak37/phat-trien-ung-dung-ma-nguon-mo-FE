// src/components/layout/RightPanel.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/tokenStore";
import ReputationBadge from "@/utils/ReputationBadge"; // Đảm bảo đường dẫn đúng
import {
  FireIcon,
  ArrowTrendingUpIcon,
  ChatBubbleLeftRightIcon,
  TrophyIcon,
  UserCircleIcon,
  PencilSquareIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

// Helper lấy ảnh avatar
const getAvatarUrl = (url?: string | null) => {
  const API_DOMAIN = process.env.NEXT_PUBLIC_URL_BACKEND_IMG || "http://localhost:8000";
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_DOMAIN}/${url.replace(/^\//, "")}`;
};

// --- 1. USER WIDGET (Soft Blue Theme) ---
const UserWidget = () => {
  const { user } = useAuthStore();

  // A. Chưa đăng nhập
  if (!user) {
    return (
      <div className="mb-6 rounded-2xl border border-blue-100 bg-white p-6 shadow-sm shadow-blue-50 text-center">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <SparklesIcon className="w-6 h-6 text-blue-500"/>
        </div>
        <h3 className="font-bold text-slate-800 mb-2">Tham gia cộng đồng</h3>
        <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Đăng nhập để thảo luận, tích điểm uy tín và kết nối với hàng nghìn thành viên khác.
        </p>
        <Link 
          href="/auth/login"
          className="block w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
        >
          Đăng nhập ngay
        </Link>
        <div className="mt-3 text-[11px] text-slate-400">
            Chưa có tài khoản? <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">Đăng ký</Link>
        </div>
      </div>
    );
  }

  // B. Đã đăng nhập
  const avatarSrc = getAvatarUrl(user.url_avatar);

  return (
    <div className="mb-6 rounded-2xl border border-blue-100 bg-white overflow-hidden shadow-sm shadow-blue-50 group">
      {/* Cover: Gradient xanh nhẹ */}
      <div className="h-24 gradient-to-r from-blue-200 via-blue-100 to-white"></div>

      <div className="px-5 pb-5 -mt-12 relative">
        {/* Avatar & Edit Button */}
        <div className="flex justify-between items-end">
          <div className="w-20 h-20 rounded-full border-[3px] border-white bg-white overflow-hidden shadow-md shadow-blue-100/50">
             {avatarSrc ? (
               <Image src={avatarSrc} alt="avatar" width={80} height={80} className="object-cover w-full h-full" />
             ) : (
               <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-300">
                 <UserCircleIcon className="w-12 h-12" />
               </div>
             )}
          </div>
          <Link href="/settings" className="mb-1 p-2 rounded-full bg-slate-50 text-slate-400 border border-transparent hover:border-blue-100 hover:text-blue-600 hover:bg-blue-50 transition-all">
             <PencilSquareIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* User Info */}
        <div className="mt-3">
          <h3 className="font-bold text-lg text-slate-800 leading-tight">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-xs text-slate-500 font-medium">@{user.firstName?.toLowerCase() || "user"}</p>
        </div>

        {/* Stats: Reputation Score */}
        <div className="mt-4 flex items-center gap-4 py-3 border-y border-blue-50">
           <div className="flex items-center gap-2.5 text-yellow-600 bg-yellow-50/50 px-3 py-1.5 rounded-lg border border-yellow-100/50">
              <TrophyIcon className="w-5 h-5" />
              <div className="flex flex-col">
                 <span className="text-sm font-bold leading-none">{user.reputation_score || 0}</span>
                 <span className="text-[9px] font-bold text-yellow-600/70 uppercase tracking-wide">Điểm uy tín</span>
              </div>
           </div>
           
           {/* FIX: w-[1px] -> w-px */}
           <div className="w-px h-8 bg-blue-100"></div>

           <div className="flex flex-col justify-center">
               <span className="text-[10px] text-slate-400 mb-0.5 font-medium">Danh hiệu</span>
               <ReputationBadge score={user.reputation_score || 0} size="md" showScore={false} />
           </div>
        </div>

        {/* Bio */}
        <div className="mt-4">
           {user.description ? (
             <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{user.description}</p>
           ) : (
             <div className="text-center py-3 bg-blue-50/30 rounded-xl border border-dashed border-blue-200 hover:border-blue-300 transition-colors cursor-pointer group/bio">
               <p className="text-xs text-slate-400 italic group-hover/bio:text-slate-500">"Chưa có giới thiệu bản thân"</p>
               <Link href="/settings" className="text-xs text-blue-500 font-bold hover:underline mt-1 block">
                 + Thêm mô tả ngay
               </Link>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- 2. TRENDING WIDGET (Soft Blue Style) ---
const TrendingWidget = () => (
  // Sticky top để khi scroll nó trượt theo (top-24 để tránh Navbar)
  <div className="rounded-2xl border border-blue-100 bg-white overflow-hidden shadow-sm shadow-blue-50 sticky top-24">
    {/* Header */}
    <div className="px-5 py-4 border-b border-blue-50 flex items-center justify-between bg-slate-50/50">
      <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
        <FireIcon className="w-5 h-5 text-orange-500" />
        Chủ đề nổi bật
      </h3>
    </div>

    {/* List */}
    <ul className="divide-y divide-blue-50">
      {[
        {
          title: "Đánh giá chi tiết NextJS 14 App Router",
          replies: 342,
          tag: "Tech",
          // Màu tag nhẹ nhàng hơn
          color: "bg-blue-50 text-blue-600 border-blue-100",
        },
        {
          title: "Làm sao để tối ưu SEO cho React?",
          replies: 128,
          tag: "Hỏi đáp",
          color: "bg-emerald-50 text-emerald-600 border-emerald-100",
        },
        { 
          title: "Góc khoe góc làm việc tháng 12", 
          replies: 89, 
          tag: "Showcase",
          color: "bg-violet-50 text-violet-600 border-violet-100",
        },
      ].map((item, i) => (
        <li key={i}>
          <Link
            href="#"
            className="block px-5 py-3.5 hover:bg-blue-50/40 transition-colors group"
          >
            <h4 className="text-[13px] font-semibold text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {item.title}
            </h4>
            <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${item.color}`}>
                {item.tag}
              </span>
              <span className="flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                <ChatBubbleLeftRightIcon className="w-3.5 h-3.5" /> {item.replies}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>

    {/* Footer Widget */}
    <div className="p-3 bg-slate-50/50 border-t border-blue-50">
      <button className="w-full py-2 text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-white rounded-lg transition-all flex items-center justify-center gap-2 border border-transparent hover:border-blue-100 hover:shadow-sm">
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
      <div className="px-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-slate-400 font-medium">
        <Link href="#" className="hover:text-blue-500 transition-colors">Điều khoản</Link>
        <Link href="#" className="hover:text-blue-500 transition-colors">Quyền riêng tư</Link>
        <Link href="#" className="hover:text-blue-500 transition-colors">Hỗ trợ</Link>
        <span className="w-full text-center mt-1 text-slate-300">© 2025 Messmer Community</span>
      </div>
    </aside>
  );
};

export default RightPanel;