"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/tokenStore";
import {
  MagnifyingGlassIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightStartOnRectangleIcon,
  SparklesIcon // Đổi FireIcon thành Sparkles cho nhẹ nhàng hơn (tuỳ chọn)
} from "@heroicons/react/24/outline";
import SearchBar from "../ui/SearchBar";
import { motion, AnimatePresence } from "framer-motion";

// --- LOGO COMPONENT (Soft Blue Theme) ---
const Logo = () => (
  <div className="flex items-center gap-2.5 group cursor-pointer">
    {/* Icon nền xanh nhạt, icon chính xanh đậm hơn */}
    <div className="relative w-10 h-10 flex items-center justify-center bg-blue-50 rounded-xl group-hover:bg-blue-100 group-hover:scale-105 transition-all duration-300 shadow-sm shadow-blue-100">
      <SparklesIcon className="w-6 h-6 text-blue-500 group-hover:text-blue-600 transition-colors" />
    </div>
    <div className="flex flex-col">
      <span className="font-extrabold text-xl tracking-tight text-slate-800 leading-none group-hover:text-blue-600 transition-colors">
        Messmer
      </span>
      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
        Community
      </span>
    </div>
  </div>
);

// --- NAV LINKS DATA ---
const NAV_ITEMS = [
  { label: "Bảng tin", href: "/" },
  { label: "Thảo luận", href: "/forums" },
  { label: "Thư viện", href: "/gallery" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false); // Dùng nếu muốn effect cho khung search ngoài
  
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* FIX: supports-backdrop-filter (Linter fix)
         STYLE: Border xanh rất nhạt (border-blue-50/50) tạo cảm giác trong suốt 
      */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-blue-100/50 supports-backdrop-filter:bg-white/60 shadow-sm shadow-blue-50/50">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* 1. LEFT: LOGO & DESKTOP NAV */}
          <div className="flex items-center gap-8">
            <Link href="/home" className="shrink-0">
              <Logo />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center p-1 bg-slate-50/50 rounded-full border border-blue-50/30">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ease-out ${
                      isActive 
                        ? "text-blue-600 bg-white shadow-sm shadow-blue-100 ring-1 ring-blue-50" 
                        : "text-slate-500 hover:text-blue-500 hover:bg-blue-50/50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 2. MIDDLE: SEARCH BAR */}
          <div className={`hidden md:block flex-1 max-w-md transition-all duration-300`}>
             <SearchBar/>
          </div>

          {/* 3. RIGHT: ACTIONS & USER */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Icon Mobile */}
            <button className="md:hidden p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
               <MagnifyingGlassIcon className="w-5 h-5" />
            </button>

            {/* Notification */}
            <button className="relative p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all group">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-white"></span>
            </button>

            {/* FIX: w-[1px] -> w-px */}
            <div className="h-6 w-px bg-blue-100 hidden sm:block"></div>

            {/* User Dropdown */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-full border transition-all duration-200 ${
                        isProfileOpen 
                        ? "bg-blue-50 border-blue-200" 
                        : "border-transparent hover:bg-slate-50 hover:border-blue-100"
                    }`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden ring-2 ring-white shadow-sm">
                    {user.url_avatar ? (
                        <Image src={user.url_avatar} alt="User" width={32} height={32} className="object-cover w-full h-full" />
                    ) : (
                        // FIX: bg-gradient-to-br standard style (linter may suggest linear-to-br for v4 but gradient is safer for v3)
                        <div className="w-full h-full gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                            {user.firstName?.charAt(0)}
                        </div>
                    )}
                  </div>
                  <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform duration-200 hidden sm:block ${isProfileOpen ? "rotate-180 text-blue-500" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isProfileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-50 py-2 z-50 origin-top-right"
                        >
                            <div className="px-4 py-3 border-b border-slate-50 mb-1">
                                <p className="text-sm font-bold text-slate-800 truncate">{user.firstName} {user.lastName}</p>
                                <p className="text-xs text-slate-500 truncate">@{user.firstName?.toLowerCase() || "user"}</p>
                            </div>
                            
                            <div className="px-2 space-y-1">
                                <Link href={`/profile/${user.user_id}`} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                    <UserCircleIcon className="w-5 h-5" /> Trang cá nhân
                                </Link>
                                <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                    <Cog6ToothIcon className="w-5 h-5" /> Cài đặt
                                </Link>
                            </div>

                            <div className="border-t border-slate-50 mt-2 pt-1 px-2">
                                <button 
                                    onClick={() => { logout(); setIsProfileOpen(false); }}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                                >
                                    <ArrowRightStartOnRectangleIcon className="w-5 h-5" /> Đăng xuất
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Link href="/auth/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 px-3 py-2 transition-colors">
                        Đăng nhập
                    </Link>
                    <Link href="/auth/resigner" className="text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 px-5 py-2.5 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all hidden sm:block">
                        Đăng ký
                    </Link>
                </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xl shadow-blue-100/20 z-30 overflow-hidden"
            >
                <div className="p-4 space-y-4">
                    {/* Mobile Search */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                        <input type="text" placeholder="Tìm kiếm..." className="w-full bg-blue-50/50 border border-blue-100 rounded-xl py-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all text-slate-700" />
                    </div>

                    {/* Mobile Nav Links */}
                    <nav className="flex flex-col space-y-1">
                        {NAV_ITEMS.map((item) => (
                            <Link 
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                                    pathname === item.href 
                                    ? "bg-blue-50 text-blue-600" 
                                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-500"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};