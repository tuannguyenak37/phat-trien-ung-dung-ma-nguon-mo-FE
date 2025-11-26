"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/store/tokenStore";
import { FireIcon } from "@heroicons/react/24/solid";
import { UserIcon, ArrowLongRightIcon } from "@heroicons/react/24/outline";

const UserWidget = () => {
  const { user, isAuthenticated } = useAuthStore();

  // --- TRƯỜNG HỢP 1: ĐÃ ĐĂNG NHẬP (MESSMER STYLE) ---
  if (isAuthenticated && user) {
    return (
      <div className="mb-8 w-full group relative">
        <div className="relative bg-[#050505] border border-red-900/40 hover:border-red-600/60 transition-colors duration-500 overflow-hidden shadow-lg shadow-red-900/5">
          {/* Decor: Vệt đỏ ma mị phía trên */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-900 via-red-500 to-black"></div>

          <div className="p-5 relative z-10">
            {/* Header: Avatar & Info */}
            <div className="flex items-start gap-4">
              {/* Avatar khung vuông Gothic */}
              <div className="relative shrink-0 group-hover:scale-105 transition-transform duration-500">
                <div className="w-14 h-14 bg-black border border-red-800 flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                  <FireIcon className="w-8 h-8 text-red-600 animate-[pulse_4s_ease-in-out_infinite]" />
                </div>
                {/* Họa tiết góc */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-red-500"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-red-500"></div>
              </div>

              {/* Tên & Role */}
              <div className="flex-1 min-w-0 pt-0.5">
                <h3 className="font-serif font-bold text-gray-100 text-lg leading-tight uppercase tracking-wide truncate">
                  {user.lastName} {user.firstName}
                </h3>
                <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-[0.2em] mt-1">
                  {user.role === "admin" ? "Lord of Cinder" : "Kindled One"}
                </p>
              </div>
            </div>

            {/* Divider: Mũi giáo ngăn cách */}
            <div className="flex items-center gap-2 my-5 opacity-40 group-hover:opacity-100 transition-opacity duration-500">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              <div className="rotate-45 w-1.5 h-1.5 bg-red-500"></div>
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
            </div>

            {/* Action: Nút xem Profile */}
            <div className="flex flex-col gap-3">
              <p className="text-xs text-gray-500 font-serif italic text-center px-2 line-clamp-1">
                Ngọn lửa vẫn đang dẫn lối...
              </p>

              <Link
                href="/profile"
                className="group/btn relative w-full flex items-center justify-center gap-2 py-2.5 bg-red-950/10 hover:bg-red-900/30 border border-red-900/30 hover:border-red-500/50 transition-all duration-300"
              >
                <span className="text-[10px] font-bold text-red-200 uppercase tracking-widest group-hover/btn:text-white">
                  View Profile
                </span>
                <ArrowLongRightIcon className="w-4 h-4 text-red-500 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TRƯỜNG HỢP 2: KHÁCH (CHƯA ĐĂNG NHẬP) ---
  return (
    <div className="mb-8 w-full bg-[#050505] border border-gray-800 hover:border-gray-600 transition-colors p-6 text-center group relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gray-500 to-transparent opacity-20 group-hover:opacity-50 transition-opacity"></div>

      <UserIcon className="w-10 h-10 text-gray-700 group-hover:text-gray-500 mx-auto mb-3 transition-colors" />

      <h4 className="text-sm font-serif text-gray-300 mb-1 uppercase tracking-wider">
        Khách Vãng Lai
      </h4>
      <p className="text-[10px] text-gray-600 mb-4">
        Bạn chưa thắp sáng ngọn lửa của mình.
      </p>

      <Link
        href="/login"
        className="block w-full py-2 text-xs font-bold text-black bg-gray-200 hover:bg-white transition-colors uppercase tracking-wide"
      >
        Đăng Nhập
      </Link>
    </div>
  );
};

export default UserWidget;
