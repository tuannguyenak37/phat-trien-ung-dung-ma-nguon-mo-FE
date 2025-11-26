"use client";

import { useAuthStore } from "@/lib/store/tokenStore";
import { BellIcon, Bars3Icon } from "@heroicons/react/24/outline";

export default function AdminHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Left: Nút mở menu mobile (nếu làm responsive sau này) */}
      <button className="md:hidden text-gray-500">
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Right: User Info */}
      <div className="flex items-center space-x-6 ml-auto">
        {/* Nút thông báo */}
        <button className="relative text-gray-500 hover:text-blue-600 transition-colors">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-800">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-blue-500 font-medium uppercase">
              {user?.role}
            </p>
          </div>
          {/* Avatar giả lập từ chữ cái đầu */}
          <div className="w-10 h-10 rounded-full gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            {user?.firstName?.[0]?.toUpperCase() || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}