"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/tokenStore";
import clsx from "clsx";
import {
  HomeIcon,
  FolderIcon,
  DocumentTextIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon },
  { name: "Quản lý Danh mục", href: "/admin/categories", icon: FolderIcon },
  { name: "Quản lý Bài viết", href: "/admin/threads", icon: DocumentTextIcon },
  { name: "Quản lý Tags", href: "/admin/tags", icon: TagIcon },
  { name: "Người dùng", href: "/admin/users", icon: UsersIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col shadow-xl fixed left-0 top-0 z-50">
      {/* 1. LOGO */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider text-blue-400">
          MY ADMIN
        </h1>
      </div>

      {/* 2. MENU */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" // Đang chọn
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"  // Bình thường
              )}
            >
              <item.icon className="w-6 h-6 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* 3. LOGOUT BUTTON */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}