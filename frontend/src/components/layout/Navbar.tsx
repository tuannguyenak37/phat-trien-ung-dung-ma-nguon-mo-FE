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
  FireIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

// --- LOGO COMPONENT (Modernized) ---
const Logo = () => (
  <div className="flex items-center gap-2.5 group">
    <div className="relative w-10 h-10 flex items-center justify-center bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
      <FireIcon className="w-6 h-6 text-primary" />
    </div>
    <div className="flex flex-col">
      <span className="font-extrabold text-xl tracking-tight text-gray-900 leading-none group-hover:text-primary transition-colors">
        Messmer
      </span>
      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">
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
  
  // State quản lý Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Ref để click outside đóng menu
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

  // Đóng mobile menu khi chuyển trang
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* 1. LEFT: LOGO & DESKTOP NAV */}
          <div className="flex items-center gap-8">
            <Link href="/" className="shrink-0">
              <Logo />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 2. MIDDLE: SEARCH BAR (Responsive) */}
          <div className={`hidden md:block flex-1 max-w-md transition-all duration-300 ${isSearchFocused ? "scale-105" : ""}`}>
            <div className={`relative flex items-center w-full rounded-full transition-all duration-200 ${
                isSearchFocused 
                ? "bg-white ring-2 ring-primary/20 shadow-lg shadow-primary/5" 
                : "bg-gray-100 hover:bg-gray-200/70"
            }`}>
              <MagnifyingGlassIcon className={`w-5 h-5 ml-4 ${isSearchFocused ? "text-primary" : "text-gray-400"}`} />
              <input
                type="text"
                placeholder="Tìm kiếm chủ đề, bài viết..."
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-900 placeholder-gray-500 py-2.5 pl-3 pr-4 rounded-full"
              />
            </div>
          </div>

          {/* 3. RIGHT: ACTIONS & USER */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Icon Mobile */}
            <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full">
               <MagnifyingGlassIcon className="w-6 h-6" />
            </button>

            {/* Notification */}
            <button className="relative p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-full transition-all group">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>

            {/* User Dropdown */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white shadow-sm">
                    {user.url_avatar ? (
                        <Image src={user.url_avatar} alt="User" width={32} height={32} className="object-cover w-full h-full" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                            {user.firstName?.charAt(0)}
                        </div>
                    )}
                  </div>
                  <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 hidden sm:block ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isProfileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.1 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 origin-top-right"
                        >
                            <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                <p className="text-sm font-bold text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                                <p className="text-xs text-gray-500 truncate">@{user.firstName?.toLowerCase() || "user"}</p>
                            </div>
                            
                            <div className="px-2 space-y-1">
                                <Link href={`/profile/${user.user_id}`} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-50 hover:text-primary transition-colors">
                                    <UserCircleIcon className="w-5 h-5" /> Trang cá nhân
                                </Link>
                                <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-xl hover:bg-gray-50 hover:text-primary transition-colors">
                                    <Cog6ToothIcon className="w-5 h-5" /> Cài đặt
                                </Link>
                            </div>

                            <div className="border-t border-gray-50 mt-2 pt-1 px-2">
                                <button 
                                    onClick={() => { logout(); setIsProfileOpen(false); }}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-xl hover:bg-red-50 transition-colors"
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
                    <Link href="/auth/login" className="text-sm font-semibold text-gray-600 hover:text-primary px-3 py-2">
                        Đăng nhập
                    </Link>
                    <Link href="/auth/resigner" className="text-sm font-bold text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-full shadow-lg shadow-primary/20 transition-all hidden sm:block">
                        Đăng ký
                    </Link>
                </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
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
                className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-gray-200 shadow-2xl z-30 overflow-hidden"
            >
                <div className="p-4 space-y-4">
                    {/* Mobile Search */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder="Tìm kiếm..." className="w-full bg-gray-100 rounded-xl py-3 pl-10 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>

                    {/* Mobile Nav Links */}
                    <nav className="flex flex-col space-y-1">
                        {NAV_ITEMS.map((item) => (
                            <Link 
                                key={item.href}
                                href={item.href}
                                className={`px-4 py-3 rounded-xl text-sm font-semibold ${
                                    pathname === item.href ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50"
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